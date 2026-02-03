"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState } from "react"

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
})

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Failed to create project")

      router.push("/dashboard/projects")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/projects" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Projects
        </Link>
      <Card>
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
          <CardDescription>Start a new project to track your team&apos;s tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Website Redesign" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of the project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                  <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Project"}
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

import Link from "next/link"
