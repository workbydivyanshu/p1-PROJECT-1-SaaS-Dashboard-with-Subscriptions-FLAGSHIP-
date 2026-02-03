import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id

    // 1. Overview Metrics
    // Fetch projects where user is owner or member
    const projects = await prisma.project.findMany({
        where: {
            OR: [
                { ownerId: userId },
                { members: { some: { userId } } }
            ]
        },
        include: {
            tasks: true
        }
    })

    const totalProjects = projects.length
    
    // Aggregate tasks from all accessible projects
    const allTasks = projects.flatMap(p => p.tasks)
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter(t => t.status === "DONE").length
    const pendingTasks = allTasks.filter(t => t.status === "TODO").length
    const inProgressTasks = allTasks.filter(t => t.status === "IN_PROGRESS").length


    // 2. Tasks by Status (for Bar Chart)
    const tasksByStatus = [
        { name: "Todo", value: pendingTasks },
        { name: "In Progress", value: inProgressTasks },
        { name: "Done", value: completedTasks }
    ]

    // 3. Completion Trend (Last 7 days)
    // Group completed tasks by date
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentCompletedTasks = allTasks.filter(t => 
        t.status === "DONE" && 
        new Date(t.updatedAt) > sevenDaysAgo
    )

    // Initialize last 7 days map
    const trendMap = new Map<string, number>()
    for (let i = 0; i < 7; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        trendMap.set(d.toISOString().split('T')[0], 0)
    }

    recentCompletedTasks.forEach(t => {
        const dateKey = new Date(t.updatedAt).toISOString().split('T')[0]
        if (trendMap.has(dateKey)) {
            trendMap.set(dateKey, (trendMap.get(dateKey) || 0) + 1)
        }
    })

    // Convert to array and reverse to show oldest first
    const completionTrend = Array.from(trendMap.entries())
        .map(([date, count]) => ({ date, count }))
        .reverse()


    return NextResponse.json({
        overview: {
            totalProjects,
            totalTasks,
            completedTasks
        },
        tasksByStatus,
        completionTrend
    })

  } catch (error) {
    console.log("[ANALYTICS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
