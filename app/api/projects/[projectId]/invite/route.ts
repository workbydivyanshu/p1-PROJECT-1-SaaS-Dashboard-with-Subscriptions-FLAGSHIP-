import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["MEMBER", "VIEWER"]),
})

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth()
    const { projectId } = await params;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { email, role } = inviteSchema.parse(await req.json())

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true }
    })

    if (!project) {
        return new NextResponse("Project not found", { status: 404 })
    }

    if (project.ownerId !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findFirst({
        where: {
            projectId,
            user: {
                email
            }
        }
    })

    if (existingMember) {
        return new NextResponse("User is already a member", { status: 400 })
    }
    
    // Check if invite already exists
    const existingInvite = await prisma.invitation.findFirst({
        where: {
            projectId,
            email
        }
    })

    if (existingInvite) {
        return new NextResponse("Invitation already sent", { status: 400 })
    }

    const token = uuidv4()
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const invitation = await prisma.invitation.create({
        data: {
            email,
            role,
            projectId,
            token,
            expires
        }
    })

    console.log(`[MOCK EMAIL] Invitation sent to ${email} with token: ${token}`)

    return NextResponse.json(invitation)

  } catch (error) {
    if (error instanceof z.ZodError) {
        return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    console.log("[INVITE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
