import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Folder } from "lucide-react"
import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ProjectsPage() {
    const session = await auth()
    
    if (!session?.user?.id) {
        redirect("/api/auth/signin")
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
        },
        include: {
            _count: {
                select: { tasks: true }
            }
        }
    })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
           <p className="text-muted-foreground">Manage and track your projects.</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 && (
            <div className="col-span-full h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/10 text-muted-foreground">
                <Folder className="h-12 w-12 mb-4 opacity-20" />
                <p className="font-medium">No projects yet</p>
                <p className="text-sm mb-6">Create your first project to get started.</p>
                <Link href="/dashboard/projects/new">
                    <Button>Create Project</Button>
                </Link>
            </div>
        )}

        {projects.map((project) => (
            <Card key={project.id} className="group transition-all hover:shadow-md border-muted">
                <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                        <Link href={`/dashboard/projects/${project.id}`} className="hover:underline decoration-primary/30 underline-offset-4">
                            {project.name}
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                        {project.description || "No description provided."}
                    </p>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground border-t pt-4 bg-muted/20">
                    <div className="flex gap-4">
                        <span>{project._count.tasks} Tasks</span>
                        <span>Updated {project.updatedAt.toLocaleDateString()}</span>
                    </div>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  )
}
