import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { redirect } from "next/navigation"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await auth()
    const { token } = await params;

    if (!session?.user?.email) {
      // Redirect to login with callback URL
      return redirect(`/api/auth/signin?callbackUrl=/invite/${token}`) 
      // Note: This relies on how NextAuth handles callbacks. 
      // Ideally we would want a client page, but for API route just return 401 or redirect.
      // Better: redirect to login page.
    }

    const invitation = await prisma.invitation.findUnique({
        where: { token }
    })

    if (!invitation) {
        return new NextResponse("Invitation not found", { status: 404 })
    }

    if (invitation.expires < new Date()) {
        return new NextResponse("Invitation expired", { status: 410 })
    }

    // Optional: Email match check
    // if (invitation.email !== session.user.email) {
    //      // Decided to skip for now to allow claiming by any logged in user? 
    //      // No, security risk. Must match email.
    //      // Actually for "invite link" style, usually ANYONE can claim. 
    //      // But here we stored EMAIL in invitation. strict check is better.
    // }
    
    // Strict check:
    if (invitation.email.toLowerCase() !== session.user.email.toLowerCase()) {
        return new NextResponse("This invitation is not for your email address.", { status: 403 })
    }

    // Create member
    await prisma.projectMember.create({
        data: {
            projectId: invitation.projectId,
            userId: session.user.id!,
            role: invitation.role
        }
    })

    // Delete invite
    await prisma.invitation.delete({
        where: { id: invitation.id }
    })

    return redirect(`/dashboard/projects/${invitation.projectId}`)

  } catch (error) {
    console.log("[INVITE_ACCEPT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
