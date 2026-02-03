"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts"

interface AnalyticsData {
    overview: {
        totalProjects: number
        totalTasks: number
        completedTasks: number
    }
    tasksByStatus: { name: string, value: number }[]
    completionTrend: { date: string, count: number }[]
}

export const AnalyticsView = () => {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/analytics")
                setData(response.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <div className="p-8">Loading analytics...</div>
    }

    if (!data) {
        return <div className="p-8">Failed to load data.</div>
    }

    return (
        <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview.totalProjects}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview.totalTasks}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="text-2xl font-bold">{data.overview.completedTasks}</div>
                         <p className="text-xs text-muted-foreground">Lifetime</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Status Bar Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Tasks by Status</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data.tasksByStatus}>
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Bar dataKey="value" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Trend Line Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Completion Trend (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={data.completionTrend}>
                                 <XAxis 
                                    dataKey="date" 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    // Format data to short day if needed
                                />
                                <YAxis 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
