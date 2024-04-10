import { PrismaClient } from '@prisma/client'

	const prisma = new PrismaClient()

const firstTargetId = '0730ffac-d039-4194-9571-01aa2aa0efbd'
const firstTargetCreationDate = new Date('2022-12-31T03:00:00.000')

const secondTargetId = '00880d75-a933-4fef-94ab-e05744435297'
const secondTargetCreationDate = new Date('2023-01-03T03:00:00.000')

const thirdTargetId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00'
const thirdTargetCreationDate = new Date('2023-01-08T03:00:00.000')

async function run() {
  await prisma.target.deleteMany()
  await prisma.day.deleteMany()

  /**
   * Create targets
   */
  await Promise.all([
    prisma.target.create({
      data: {
        id: firstTargetId,
        title: 'Beber 2L água',
        created_at: firstTargetCreationDate,
        weekDays: {
          create: [
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
          ]
        }
      }
    }),

    prisma.target.create({
      data: {
        id: secondTargetId,
        title: 'Exercitar',
        created_at: secondTargetCreationDate,
        weekDays: {
          create: [
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
          ]
        }
      }
    }),

    prisma.target.create({
      data: {
        id: thirdTargetId,
        title: 'Dormir 8h',
        created_at: thirdTargetCreationDate,
        weekDays: {
          create: [
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
          ]
        }
      }
    })
  ])

  await Promise.all([
    /**
     * Targets (Complete/Available): 1/1
     */
    prisma.day.create({
      data: {
        /** Monday */
        date: new Date('2023-01-02T03:00:00.000z'),
        dayTargets: {
          create: {
            target_id: firstTargetId,
          }
        }
      }
    }),

    /**
     * Targets (Complete/Available): 1/1
     */
    prisma.day.create({
      data: {
        /** Friday */
        date: new Date('2023-01-06T03:00:00.000z'),
        dayTargets: {
          create: {
            target_id: firstTargetId,
          }
        }
      }
    }),

    /**
     * Targets (Complete/Available): 2/2
     */
    prisma.day.create({
      data: {
        /** Wednesday */
        date: new Date('2023-01-04T03:00:00.000z'),
        dayTargets: {
          create: [
            { target_id: firstTargetId },
            { target_id: secondTargetId },
          ]
        }
      }
    }),
  ])
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })