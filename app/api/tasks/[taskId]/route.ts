import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const taskUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
})

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const session = await auth()
    const { taskId } = await params;
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    // Verify access (Project Owner or Creator could delete, simple check for now: Project Member)
    // Detailed permission check simpler: fetch task -> project -> check user access
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { project: true }
    })

    if (!task) return new NextResponse("Not found", { status: 404 })

    if (task.project.ownerId !== session.user.id) {
         // Check if member
         const member = await prisma.projectMember.findUnique({
             where: { projectId_userId: { projectId: task.projectId, userId: session.user.id } }
         })
         if (!member) return new NextResponse("Forbidden", { status: 403 })
    }

    await prisma.task.delete({ where: { id: taskId } })

    return new NextResponse(null, { status: 204 })
  } catch {
    return new NextResponse(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const session = await auth()
    const { taskId } = await params;
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    const json = await req.json()
    const body = taskUpdateSchema.parse(json)

    // Access check similar to DELETE
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { project: true }
    })

    if (!task) {
      return new NextResponse("Not found", { status: 404 })
    }

    if (task.project.ownerId !== session.user.id) {
         const member = await prisma.projectMember.findUnique({
             where: { projectId_userId: { projectId: task.projectId, userId: session.user.id } }
         })
         if (!member) return new NextResponse("Forbidden", { status: 403 })
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse(null, { status: 500 })
  }
}
