
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || !session.user.id) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    // Verify signature
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret"
    const expectedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex")

    if (expectedSignature !== razorpay_signature) {
        return new NextResponse("Invalid Signature", { status: 400 })
    }

    // Update user to PRO
    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            razorpayCustomerId: razorpay_payment_id, // Storing payment ID as customer ref for now
            razorpaySubscriptionId: "pro_plan_active",
            // You might want to also set a subscription end date logic here
        }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Razorpay Verify Error:", error)
    return new NextResponse("Error verifying payment", { status: 500 })
  }
}
