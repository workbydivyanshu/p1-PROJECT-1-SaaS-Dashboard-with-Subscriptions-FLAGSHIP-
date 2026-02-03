"use client"

import axios from "axios"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SubscriptionButtonProps {
  isPro: boolean
}

export const SubscriptionButton = ({
  isPro = false
}: SubscriptionButtonProps) => {
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    try {
      setLoading(true)
      const response = await axios.post("/api/stripe/checkout")
      window.location.href = response.data.url
    } catch (error) {
      console.log("BILLING_ERROR", error)
      // toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant={isPro ? "default" : "premium"} onClick={onClick} disabled={loading}>
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  )
}
