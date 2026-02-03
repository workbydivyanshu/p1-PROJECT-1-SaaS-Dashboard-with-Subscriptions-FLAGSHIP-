import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Settings } from "lucide-react"
import { Task } from "@prisma/client"

import { CreateTaskDialog } from "@/components/create-task-dialog"

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const session = await auth()
  const { projectId } = await params;
  
  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
          { ownerId: session.user.id },
          { members: { some: { userId: session.user.id } } }
      ]
    },
    include: {
        tasks: {
            orderBy: { createdAt: 'desc' }
        }
    }
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
             <Link href="/dashboard/projects">
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                <p className="text-muted-foreground">{project.description}</p>
            </div>
        </div>
        <div className="flex gap-2">
            <Link href={`/dashboard/projects/${projectId}/settings`}>
                <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                </Button>
            </Link>
            <CreateTaskDialog projectId={project.id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
                    <div key={status} className="flex-1 min-w-[300px]">
                      <h3 className="font-semibold mb-4 flex items-center">
                        {status.replace("_", " ")}
                         <span className="ml-auto text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border">
                            {project.tasks.filter((t: Task) => t.status === status).length}
                         </span>
                      </h3>
                      
                      <div className="space-y-4">
                        {project.tasks
                          .filter((t: Task) => t.status === status)
                          .map((task: Task) => (
                          <Card key={task.id}>
                            <CardContent className="p-4">
                              <p className="font-medium">{task.title}</p>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span>{task.updatedAt.toLocaleDateString()}</span>
                                <div className="flex gap-2">
                                     <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                         {/* Edit icon placeholder */}
                                     </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {project.tasks.filter((t: Task) => t.status === status).length === 0 && (
                            <div className="text-center text-sm text-muted-foreground py-8 border border-dashed rounded-lg">
                                No tasks
                            </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
      </div>
    </div>
  )
}
