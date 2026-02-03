import Stripe from "stripe"

// Lazy initialization to prevent build-time errors when env vars aren't available
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set")
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    })
  }
  return stripeInstance
}

// For backwards compatibility - will throw during build if accessed
export const stripe = {
  get checkoutSessions() { return getStripe().checkout.sessions },
  get customers() { return getStripe().customers },
  get subscriptions() { return getStripe().subscriptions },
  get prices() { return getStripe().prices },
  get webhooks() { return getStripe().webhooks },
}
