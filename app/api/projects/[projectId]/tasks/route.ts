import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
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
    
    // Check membership
    const membership = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId: session.user.id
            }
        }
    })
    
    // Also allow owner (who might not be in member table depending on implementation, but let's assume owner is added as member or check project owner)
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { ownerId: true }
    })

    if (!project) return new NextResponse("Project not found", { status: 404 })
        
    const isOwner = project.ownerId === session.user.id
    const isMember = !!membership

    if (!isOwner && !isMember) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    const json = await req.json()
    const body = taskSchema.parse(json)

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status || "TODO",
        projectId: projectId,
        // For now not assigning assignee
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse(null, { status: 500 })
  }
}

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
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            OR: [
                { ownerId: session.user.id },
                { members: { some: { userId: session.user.id } } }
            ]
        }
    })

    if (!project) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
          assignee: {
              select: {
                  name: true,
                  image: true
              }
          }
      }
    })

    return NextResponse.json(tasks)
  } catch {
    return new NextResponse(null, { status: 500 })
  }
}
