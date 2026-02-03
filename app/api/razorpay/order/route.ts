
import { auth } from "@/auth"
import { razorpay } from "@/lib/razorpay"
import { NextResponse } from "next/server"

export async function POST(_req: Request) {
  try {
    const session = await auth()
    if (!session?.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const options = {
      amount: 199900, // Amount in paise (1999.00 INR)
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    }

    const order = await razorpay.orders.create(options)
    
    return NextResponse.json(order)
  } catch (error) {
    console.error("Razorpay Error:", error)
    return new NextResponse("Error creating order", { status: 500 })
  }
}
