
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Script from "next/script"

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any
  }
}

export function RazorpayButton() {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)

    try {
      // 1. Create order
      const response = await fetch("/api/razorpay/order", { method: "POST" })
      const order = await response.json()

      // 2. Options for Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy_key", 
        amount: order.amount,
        currency: order.currency,
        name: "ProjectPulse Pro",
        description: "Upgrade to Pro Plan",
        order_id: order.id,
        handler: async function (response: any) {
             // 3. Verify Payment
             const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                })
             })

             if (verifyRes.ok) {
                 alert("Payment Successful! You are now a Pro member.")
                 window.location.reload()
             } else {
                 alert("Payment verification failed.")
             }
        },
        prefill: {
          name: "ProjectPulse User",
          email: "user@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      }

      const rzp1 = new window.Razorpay(options)
      rzp1.open()
    } catch (error) {
      console.error("Payment failed", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Button onClick={handlePayment} disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Upgrade to Pro (₹1999)
      </Button>
    </>
  )
}
