import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { InviteDialog } from "@/components/invite-dialog"
import { MembersList } from "@/components/members-list"

interface SettingsPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const session = await auth()
  const { projectId } = await params;

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
        members: {
            include: {
                user: true
            }
        },
        invitations: true
    }
  })

  if (!project) {
    return <div>Project not found</div>
  }

  const isOwner = project.ownerId === session.user.id

  // Basic RBAC for viewing settings?
  // Owners and Members can view, but only Owners can invite/remove?
  // Let's allow everyone to view the team list.
  
  return (
    <div className="flex flex-col gap-8 p-8">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Project Settings</h2>
            <p className="text-muted-foreground">Manage your project team and preferences.</p>
          </div>
          {isOwner && (
               <InviteDialog projectId={projectId} />
          )}
       </div>

       <div className="border rounded-lg p-6 bg-card">
           <MembersList 
                projectId={projectId}
                members={project.members}
                invitations={project.invitations}
                currentUserId={session.user.id}
                isOwner={isOwner}
           />
       </div>
    </div>
  )
}
