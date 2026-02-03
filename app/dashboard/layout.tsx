import { Sidebar } from "@/components/sidebar"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-muted/10 md:pl-72">
        {children}
      </main>
    </div>
  )
}
