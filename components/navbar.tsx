import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-background sticky top-0 z-50 backdrop-blur-sm">
      <Link href="/" className="text-xl font-bold flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black">P</span>
        ProjectPulse
      </Link>
      <div className="flex items-center gap-4">
        {session ? (
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link href="/api/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/api/auth/signin">
              <Button>Get Started</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
