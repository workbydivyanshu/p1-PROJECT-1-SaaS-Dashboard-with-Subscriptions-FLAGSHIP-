import { Role } from "@prisma/client"

// Mock user type if full User object isn't available, or rely on Prisma types
interface ProjectUser {
  id: string
  role?: string
}

interface ProjectMember {
  userId: string
  role: Role
}

interface ProjectWithMembers {
  ownerId: string
  members: ProjectMember[]
}

export const canEditProject = (user: ProjectUser, project: ProjectWithMembers) => {
  if (user.id === project.ownerId) return true
  // Only OWNER can edit project settings generic check
  return false
}

export const canManageMembers = (user: ProjectUser, project: ProjectWithMembers) => {
  if (user.id === project.ownerId) return true
  return false
}

// Tasks: Owner and Member can edit. Viewer cannot.
export const canEditTask = (user: ProjectUser, project: ProjectWithMembers) => {
  if (user.id === project.ownerId) return true
  const member = project.members.find((m) => m.userId === user.id)
  return member?.role === "OWNER" || member?.role === "MEMBER"
}

export const canViewProject = (user: ProjectUser, project: ProjectWithMembers) => {
    if (user.id === project.ownerId) return true
    const member = project.members.find((m) => m.userId === user.id)
    return !!member
}
