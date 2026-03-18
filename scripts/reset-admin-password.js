const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function main() {
  const prisma = new PrismaClient()
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { id: true, username: true, role: true },
      orderBy: { id: 'asc' },
    })

    const newPassword = 'Zz111111'
    const passwordHash = await bcrypt.hash(newPassword, 10)

    if (admins.length === 0) {
      const username = 'admin'
      const created = await prisma.user.upsert({
        where: { username },
        update: { passwordHash, role: 'admin' },
        create: { username, passwordHash, role: 'admin' },
        select: { id: true, username: true, role: true },
      })
      console.log('Created/updated admin user:', created)
      console.log(`Admin password set to: ${newPassword}`)
      return
    }

    console.log('Admin users:', admins)
    for (const a of admins) {
      await prisma.user.update({ where: { id: a.id }, data: { passwordHash } })
    }
    console.log(`Reset ${admins.length} admin password(s) to: ${newPassword}`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

