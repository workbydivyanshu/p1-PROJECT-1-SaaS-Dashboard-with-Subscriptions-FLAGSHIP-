import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { getStripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

const settingsUrl = process.env.NEXT_PUBLIC_APP_URL + "/dashboard/settings"

export async function POST(_req: Request) {
  try {
    const session = await auth()
    const { user } = session || {}

    if (!user || !user.id || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Need to refetch user to get stripe details safely
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id
      }
    })

    if (!dbUser) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // If user already has a stripe plan, redirect to portal
    if (dbUser.stripeCustomerId && dbUser.stripePriceId) {
      const stripeSession = await getStripe().billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: settingsUrl,
      })

      return new NextResponse(JSON.stringify({ url: stripeSession.url }))
    }

    // Otherwise, create checkout session
    const stripeSession = await getStripe().checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Pro Plan",
              description: "Unlimited projects and tasks",
            },
            unit_amount: 2000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
    })

    return new NextResponse(JSON.stringify({ url: stripeSession.url }))
  } catch (error) {
    console.log("[STRIPE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
