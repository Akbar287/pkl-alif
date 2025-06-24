import { File, Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/manajemen-data/file')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''
    const FormasiId = c.req.query('formasi-id')

    let data = null

    if (id) {
        data = await prisma.file.findFirst({ where: { FileId: id } })
    } else if (page && limit) {
        let where: Prisma.FileWhereInput = {}
        if (search) {
            if(FormasiId) {
                where = {AND: [{Nama: { contains: search, mode: 'insensitive' }}, {FormasiId: FormasiId}]}
            } else {
                where = {AND: [{Nama: { contains: search, mode: 'insensitive' }}]}
            }
        } else {
            if(FormasiId) {
                where = {FormasiId: FormasiId}
            } else {
                where = {}
            }
        }
        
        const [data, total] = await Promise.all([
            prisma.file.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.file.count({ where }),
        ])

        return c.json<{
            data: File[]
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
        data = FormasiId ? await prisma.file.findMany({where: {FormasiId: FormasiId}}) : await prisma.file.findMany()
    }
    return c.json(data)
})

app.post('/', async (c) => {
    const body: File = await c.req.json()

    const data = await prisma.file.create({
        data: {
            FormasiId: body.FormasiId,
            Nama: body.Nama,
        },
    })

    return c.json(data)
})

app.put('/', async (c) => {
    const body: File = await c.req.json()

    const data = await prisma.file.update({
        data: {
            Nama: body.Nama,
        },
        where: {
            FileId: body.FileId,
        },
    })

    return c.json(data)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    await prisma.file.delete({
        where: {
            FileId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
