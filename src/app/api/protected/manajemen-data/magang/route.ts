import { Magang, Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/manajemen-data/magang')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    let data = null
    if (id) {
        data = await prisma.magang.findFirst({ where: { MagangId: id } })
    } else if (page && limit) {
        let where: Prisma.MagangWhereInput = search
            ? {
                  OR: [{ Nama: { contains: search, mode: 'insensitive' } }],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.magang.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.magang.count({ where }),
        ])

        return c.json<{
            data: Magang[]
            page: number
            limit: number
            totalElement: number
            totalPage: number
            isFirst: boolean
            isLast: boolean
            hasNext: boolean
            hasPrevious: boolean
        }>({
            page: page,
            limit: limit,
            data: data,
            totalElement: total,
            totalPage: Math.ceil(total / limit),
            isFirst: page === 1,
            isLast:
                page === Math.ceil(total / limit) ||
                Math.ceil(total / limit) === 0,
            hasNext: page < Math.ceil(total / limit),
            hasPrevious: page > 1,
        })
    } else {
        data = await prisma.magang.findMany()
    }

    return c.json(data)
})

app.post('/', async (c) => {
    const body: Magang = await c.req.json()

    const data = await prisma.magang.create({
        data: {
            Nama: body.Nama,
            PeriodeAwal: body.PeriodeAwal,
            PeriodeAkhir: body.PeriodeAkhir
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: Magang = await c.req.json()

    const data = await prisma.magang.update({
        data: {
            Nama: body.Nama,
            PeriodeAwal: body.PeriodeAwal,
            PeriodeAkhir: body.PeriodeAkhir
        },
        where: {
            MagangId: body.MagangId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.magang.delete({
        where: {
            MagangId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
