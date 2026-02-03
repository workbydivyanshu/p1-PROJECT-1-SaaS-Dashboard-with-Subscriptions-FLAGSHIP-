import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, LayoutDashboard, Users, Zap } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 lg:py-32 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl opacity-20" />
        
        <span className="inline-block py-1 px-3 rounded-full bg-muted text-sm font-medium mb-6">
          🚀 v1.0 is now live
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm">
          Manage Projects. <br/> Without the Chaos.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          The all-in-one platform for high-performance teams. Track tasks, manage sprints, and deliver results faster than ever.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8 text-lg gap-2 w-full sm:w-auto shadow-lg shadow-primary/25">
              Start for Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="#pricing">
            <Button variant="outline" size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to ship</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for modern software teams.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
             {[ 
               { icon: LayoutDashboard, title: "Kanban & Lists", desc: "Visualize work clearly with flexible views." },
               { icon: Users, title: "Team Collaboration", desc: "Real-time updates, comments, and assignments." },
               { icon: Zap, title: "Automated Workflows", desc: "Save time with built-in automation rules." }
             ].map((f, i) => (
               <Card key={i} className="bg-background/60 backdrop-blur-sm border-muted transition-all hover:shadow-md hover:border-primary/50">
                 <CardHeader>
                   <f.icon className="w-10 h-10 text-primary mb-2" />
                   <CardTitle>{f.title}</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-muted-foreground">{f.desc}</p>
                 </CardContent>
               </Card>
             ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} ProjectPulse. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
