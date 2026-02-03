
import { prisma } from "./lib/db"

async function main() {
  console.log("🚀 Starting Comprehensive Database Integrity Test...")

  try {
    // 1. Verify User
    console.log("Step 1: Checking User...")
    const user = await prisma.user.upsert({
        where: { email: "demo@example.com" },
        update: {},
        create: {
            id: "demo-user-id",
            email: "demo@example.com",
            name: "Demo User"
        }
    })
    console.log("✅ User Verified:", user.email)

    // 2. Create Project
    console.log("Step 2: Creating Project...")
    const project = await prisma.project.create({
        data: {
            name: "Automated Test Project",
            description: "Created via integrity check script",
            ownerId: user.id,
            members: {
                create: { userId: user.id, role: "OWNER" }
            }
        }
    })
    console.log("✅ Project Created:", project.name, project.id)

    // 3. Create Task
    console.log("Step 3: Creating Task...")
    const task = await prisma.task.create({
        data: {
            title: "Test Task",
            projectId: project.id,
            status: "TODO"
        }
    })
    console.log("✅ Task Created:", task.title, task.status)

    // 4. Update Task
    console.log("Step 4: Updating Task...")
    const updatedTask = await prisma.task.update({
        where: { id: task.id },
        data: { status: "DONE" }
    })
    console.log("✅ Task Updated:", updatedTask.title, updatedTask.status)

    // 5. Cleanup
    console.log("Step 5: Cleanup...")
    await prisma.project.delete({ where: { id: project.id } })
    console.log("✅ Cleanup Complete: Project Deleted")

    console.log("🎉 ALL CRUD OPERATIONS PASSED")

  } catch (e) {
    console.error("❌ ERROR:", e)
    process.exit(1)
  }
}

main()
