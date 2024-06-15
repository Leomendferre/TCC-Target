import { FastifyInstance } from 'fastify'
import dayjs from 'dayjs'
import { z } from 'zod'
import { prisma } from './lib/prisma'

export async function appRoutes(app: FastifyInstance) {
  
  app.post('/register', async (request, reply) => {
    const createUser = z.object({
      username: z.string(),
       password: z.string()  
   })
    const { username, password } = createUser.parse(request.body)

    const user = await prisma.user.create({
      data: {
        username,
        password
      },
    });
  
    reply.send(user);
  });

  app.post('/login', async (request, reply) => {
    const User = z.object({
      username: z.string(),
       password: z.string()  
   })
    const { username, password } = User.parse(request.body)
  
    const user = await prisma.user.findUnique({
      where: {
        username,
        password
      },
    });
  
    if (!user) {
      reply.status(401).send('Usuário não encontrado');
      return;
    }
  });

  app.post('/user/:id/targets', async (request) => {
    const createTargetBody = z.object({
      title: z.string(),
      weekDays: z.array(
        z.number().min(0).max(6)
      ),
    })

    const targetUser = z.object({
      id: z.string().uuid(),
    })

    const { title, weekDays } = createTargetBody.parse(request.body)
    const { id } = targetUser.parse(request.params)

    const today = dayjs().startOf('day').toDate()

    await prisma.target.create({
      data: {
        user_id: id,
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay,
              }
          }),
        }
      }
    })
  })  

  app.get('/day', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date()
    })

    const { date } = getDayParams.parse(request.query)

    const parsedDate = dayjs(date).startOf('day')
    const weekDay = parsedDate.get('day')

    const possibleTargets = await prisma.target.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          }
        }
      },
    })

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayTargets: true,
      }
    })

    const completedTargets = day?.dayTargets.map(dayTarget => {
      return dayTarget.target_id
    }) ?? []

    return{
      possibleTargets,
      completedTargets,
    }
  })

  app.patch('/targets/:id/toggle', async (request) => {
    const toggleTargetsParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = toggleTargetsParams.parse(request.params)

    const today = dayjs().startOf('day').toDate()

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      }
    })

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today
        }
      })
    }

    const dayTarget = await prisma.dayTarget.findUnique({
      where: {
        day_id_target_id: {
          day_id: day.id,
          target_id: id
        }
      }
    }) 

    if (dayTarget) {
      await prisma.dayTarget.delete({
        where: {
          id: dayTarget.id,
        }
      })
    } else {
      await prisma.dayTarget.create({
        data: {
          day_id: day.id,
          target_id: id
        }
      })
    }

  })
 
  app.get('/user/:id/summary', async (request) => {
    const targetUser = z.object({
      id: z.string().uuid(),
    })

    const { id } = targetUser.parse(request.params)
    const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            CAST(COUNT(*) AS FLOAT)
          FROM day_targets DH
          JOIN targets T ON DH.target_id = T.id
          WHERE DH.day_id = D.id
            AND T.user_id = ${id}
        ) AS completed,
        (
          SELECT
            CAST(COUNT(*) AS FLOAT)
          FROM target_week_days HWD
          JOIN targets H ON H.id = HWD.target_id
          WHERE
            HWD.week_day = CAST(STRFTIME('%w', D.date / 1000.0, 'unixepoch') AS INT)
            AND H.created_at <= D.date
            AND H.user_id = ${id}
        ) AS amount
      FROM days D
    `
    
    return summary
  })

  app.delete('/targets/:id', async (request) => {
    const deleteTargetParams = z.object({
      id: z.string().uuid(),
    });
  
    const { id } = deleteTargetParams.parse(request.params);
    try {
      await prisma.dayTarget.deleteMany({
        where: {
          target_id: id,
        },
      });

      await prisma.targetWeekDays.deleteMany({
        where: {
          target_id: id,
        },
      });

      await prisma.target.delete({
        where: {
          id,
        },
      });
  
      return { message: 'Alvo excluído com sucesso' };
    } catch (error) {
      console.error('Erro ao excluir o alvo:', error);
      return ('Erro ao excluir o alvo');
    }
  });
}
