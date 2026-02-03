import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
           <p className="text-muted-foreground">Welcome back, {session?.user?.name || "User"}.</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1 text-green-500 font-medium">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
                <div className="text-center">
                    <p className="mb-2">No projects found</p>
                    <Link href="/dashboard/projects/new">
                        <Button variant="outline" size="sm">Create Project</Button>
                    </Link>
                </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                 <p className="text-muted-foreground text-sm text-center py-10">No tasks assigned.</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
