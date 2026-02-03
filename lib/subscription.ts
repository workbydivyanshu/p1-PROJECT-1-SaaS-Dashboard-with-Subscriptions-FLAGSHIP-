import { auth } from "@/auth"
import { prisma } from "@/lib/db"

const DAY_IN_MS = 86_400_000

export const checkSubscription = async () => {
  const session = await auth()

  if (!session?.user?.id) {
    return false
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  })

  if (!user) {
    return false
  }

  const isValid =
    user.stripePriceId &&
    (user.stripeCurrentPeriodEnd?.getTime() || 0) + DAY_IN_MS > Date.now()

  return !!isValid
}
