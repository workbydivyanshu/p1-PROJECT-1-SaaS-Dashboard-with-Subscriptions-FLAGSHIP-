"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash } from "lucide-react"

interface Member {
    id: string
    user: {
        id: string
        name: string | null
        email: string | null
        image: string | null
    }
    role: string
}

interface Invitation {
    id: string
    email: string
    role: string
    token: string
}

interface MembersListProps {
  projectId: string
  members: Member[]
  invitations: Invitation[]
  currentUserId: string
  isOwner: boolean
}

export const MembersList = ({ 
    projectId, 
    members, 
    invitations, 
    isOwner 
}: MembersListProps) => {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const onRemove = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      await axios.delete(`/api/projects/${projectId}/members?memberId=${memberId}`)
      router.refresh()
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId(null)
    }
  }

  // TODO: Implement cancel invitation
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Team Members</h3>
        <div className="space-y-4">
            {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={member.user.image || ""} />
                            <AvatarFallback>{member.user.email?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{member.user.name || "User"}</p>
                            <p className="text-sm text-muted-foreground">{member.user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-2 py-1 text-xs font-semibold bg-secondary rounded-full">
                            {member.role}
                        </div>
                        {isOwner && member.role !== "OWNER" && (
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => onRemove(member.id)}
                                disabled={loadingId === member.id}
                             >
                                 <Trash className="w-4 h-4 text-destructive" />
                             </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {invitations.length > 0 && (
         <div className="space-y-4">
            <h3 className="text-lg font-medium">Pending Invitations</h3>
             <div className="space-y-4">
                {invitations.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div>
                            <p className="font-medium">{invite.email}</p>
                            <p className="text-xs text-muted-foreground">Token: {invite.token}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-2 py-1 text-xs font-semibold bg-background border rounded-full">
                                {invite.role}
                            </div>
                         </div>
                    </div>
                ))}
             </div>
         </div>
      )}
    </div>
  )
}
