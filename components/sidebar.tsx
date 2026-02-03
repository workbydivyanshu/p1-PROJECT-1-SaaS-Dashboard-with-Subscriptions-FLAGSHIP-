"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FolderPlus, Settings, LogOut, BarChart3 } from "lucide-react"

const routes = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Projects", icon: FolderPlus, href: "/dashboard/projects" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 w-64 border-r min-h-screen bg-background hidden md:block fixed left-0 top-0", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link href="/dashboard" className="px-4 text-xl font-bold flex items-center gap-2 mb-6">
             <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black">P</span>
             ProjectPulse
          </Link>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 py-2 border-t absolute bottom-0 w-full mb-4">
          <Link href="/api/auth/signout">
              <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
                  <LogOut className="h-4 w-4" /> Logout
              </Button>
          </Link>
      </div>
    </div>
  )
}
