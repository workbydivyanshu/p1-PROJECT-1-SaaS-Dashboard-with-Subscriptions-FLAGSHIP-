import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

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

    const verifyOwner = await prisma.project.findFirst({
        where: {
            id: projectId,
            ownerId: session.user.id
        }
    })

    if (!verifyOwner) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    await prisma.project.delete({
      where: {
        id: projectId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch {
    return new NextResponse(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth()
    const { projectId } = await params;

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = projectSchema.parse(json)
    
    const verifyOwner = await prisma.project.findFirst({
        where: {
            id: projectId,
            ownerId: session.user.id
        }
    })

    if (!verifyOwner) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        name: body.name,
        description: body.description,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
     if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse(null, { status: 500 })
  }
}
