import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { SubscriptionButton } from "@/components/subscription-button"

const SettingsPage = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  })

  // Check if subscription is valid
  // Simple check: exists + period end is in future
  // eslint-disable-next-line
  const isPro = !!user?.stripePriceId && ((user.stripeCurrentPeriodEnd?.getTime() || 0) + 86_400_000 > Date.now())

  return (
    <div className="p-8">
      <div className="flex flex-col space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <div className="text-muted-foreground text-sm">
          Manage your account settings and subscription.
        </div>
        
        <div className="px-4 py-8 border rounded-lg bg-card">
           <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                 <h3 className="font-semibold text-lg">Subscription Plan</h3>
                 <p className="text-sm text-muted-foreground">
                    You are currently on the <span className="font-bold text-primary">{isPro ? "Pro" : "Free"}</span> plan.
                 </p>
              </div>
              <SubscriptionButton isPro={isPro} />
           </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
