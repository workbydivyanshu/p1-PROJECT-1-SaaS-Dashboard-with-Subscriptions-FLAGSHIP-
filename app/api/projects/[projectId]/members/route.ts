import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth()
    const { projectId } = await params;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check access
    const membership = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId: session.user.id
            }
        }
    })

    const project = await prisma.project.findUnique({
        where: { id: projectId }
    })

    if (!project) return new NextResponse("Not Found", { status: 404 })

    const isOwner = project.ownerId === session.user.id
    if (!isOwner && !membership) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    const members = await prisma.projectMember.findMany({
        where: { projectId },
        include: { user: true }
    })

    const invitations = await prisma.invitation.findMany({
        where: { projectId }
    })

    return NextResponse.json({ members, invitations })

  } catch (error) {
    console.log("[MEMBERS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const session = await auth()
        const { projectId } = await params;

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const memberId = searchParams.get("memberId")

        if (!memberId) {
             return new NextResponse("Member ID required", { status: 400 })
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId }
        })

        if (!project) return new NextResponse("Not Found", { status: 404 })

        // Only owner can remove members
        if (project.ownerId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        await prisma.projectMember.delete({
            where: { id: memberId }
        })

        return new NextResponse("Deleted", { status: 200 })

    } catch (error) {
        console.log("[MEMBERS_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
