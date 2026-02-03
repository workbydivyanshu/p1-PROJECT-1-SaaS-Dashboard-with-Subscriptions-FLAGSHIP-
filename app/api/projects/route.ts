import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"
import { checkSubscription } from "@/lib/subscription"

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = projectSchema.parse(json)

    const isPro = await checkSubscription()
    
    // Free tier limit: max 3 projects
    if (!isPro) {
       const count = await prisma.project.count({
           where: { ownerId: session.user.id }
       })

       if (count >= 3) {
           return new NextResponse("Free tier limit reached", { status: 403 })
       }
    }

    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER"
          }
        }
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

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(projects)
  } catch {
    return new NextResponse(null, { status: 500 })
  }
}
