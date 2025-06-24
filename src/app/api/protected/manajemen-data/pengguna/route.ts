import { JenisKelamin, Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { UserMhsInterface } from '@/types/ProfilTypes'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import Bycript from 'bcrypt'

const app = new Hono().basePath('/api/protected/manajemen-data/pengguna')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''

    if (id) {
        const d = await prisma.user.findFirst({ select: {
                    UserId: true,
                    Nama: true,
                    Email: true, 
                    Mhs: {
                        select: {
                            MhsId: true,
                            JenisKelamin: true,
                            Nik: true,
                            Nim: true,
                            Alamat: true,
                            AsalSekolah: true,
                        }
                    },
                    UserHasRoles: {
                        select: {Role: {select: {RoleId: true, Nama: true}}}
                    }
                }, where: { UserId: id } })
        return c.json<UserMhsInterface>({
            MhsId: d == null ? '' : d.Mhs.length === 0 ? '' : d.Mhs[0].MhsId ?? '',
            UserId: d == null ? '' : d.UserId,
            JenisKelamin: d == null ? JenisKelamin.PRIA : d.Mhs.length === 0 ? JenisKelamin.PRIA : d.Mhs[0].JenisKelamin ?? JenisKelamin.PRIA,
            Nik: d == null ? '' : d.Mhs.length === 0 ? '' : d.Mhs[0].Nik ?? '',
            Nim: d == null ? '' : d.Mhs.length === 0 ? '' : d.Mhs[0].Nim ?? '',
            Alamat: d == null ? '' : d.Mhs.length === 0 ? '' : d.Mhs[0].Alamat ?? '',
            AsalSekolah: d == null ? '' : d.Mhs.length === 0 ? '' : d.Mhs[0].AsalSekolah ?? '',
            RoleId: d == null ? '' : d.UserHasRoles.length > 0 ? d.UserHasRoles[0].Role.Nama ?? '' : '',
            Nama: d == null ? '' : d.Nama,
            Email: d == null ? '' : d.Email,
            Password: '',
        }, 200);
    } else if (page && limit) {
        let where: Prisma.UserWhereInput = search
            ? {
                  OR: [{ Nama: { contains: search, mode: 'insensitive' } }],
              }
            : {}

        const [data, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    UserId: true,
                    Nama: true,
                    Email: true, 
                    Mhs: {
                        select: {
                            MhsId: true,
                            JenisKelamin: true,
                            Nik: true,
                            Nim: true,
                            Alamat: true,
                            AsalSekolah: true,
                        }
                    },
                    UserHasRoles: {
                        select: {Role: {select: {RoleId: true, Nama: true}}}
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { Nama: 'asc' },
            }),

            prisma.user.count({ where }),
        ])

        return c.json<{
            data: UserMhsInterface[]
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
            data: data.map(d => ({
                MhsId: d.Mhs.length === 0 ? '' : d.Mhs[0].MhsId ?? '',
                UserId: d.UserId,
                JenisKelamin: d.Mhs.length === 0 ? JenisKelamin.PRIA : d.Mhs[0].JenisKelamin ?? JenisKelamin.PRIA,
                Nik: d.Mhs.length === 0 ? '' : d.Mhs[0].Nik ?? '',
                Nim: d.Mhs.length === 0 ? '' : d.Mhs[0].Nim ?? '',
                Alamat: d.Mhs.length === 0 ? '' : d.Mhs[0].Alamat ?? '',
                AsalSekolah: d.Mhs.length === 0 ? '' : d.Mhs[0].AsalSekolah ?? '',
                RoleId: d.UserHasRoles.length > 0 ? d.UserHasRoles[0].Role.RoleId ?? '' : '',
                Nama: d.Nama,
                Email: d.Email,
                Password: '',
            })),
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
        const dataPage = await prisma.user.findMany({
            select: {
                    UserId: true,
                    Nama: true,
                    Email: true, 
                    Mhs: {
                        select: {
                            MhsId: true,
                            JenisKelamin: true,
                            Nik: true,
                            Nim: true,
                            Alamat: true,
                            AsalSekolah: true,
                        }
                    },
                    UserHasRoles: {
                        select: {Role: {select: {RoleId: true, Nama: true}}}
                    }
                },
        })

        return c.json<UserMhsInterface[]>(dataPage.map(d => ({
            MhsId: d == null ? '' : d.Mhs.length === 0 ? '' : d.Mhs[0].MhsId ?? '',
            UserId: d == null ? '' : d.UserId,
            JenisKelamin: d == null ? JenisKelamin.PRIA : d.Mhs.length === 0 ? JenisKelamin.PRIA : d.Mhs[0].JenisKelamin ?? JenisKelamin.PRIA,
            Nik: d == null ? '' : d.Mhs.length === 0 ? '' : d.Mhs[0].Nik ?? '',
            Nim: d == null ? '' : d.Mhs.length === 0 ? '' : d.Mhs[0].Nim ?? '',
            Alamat: d == null ? '' : d.Mhs.length === 0 ? '' : d.Mhs[0].Alamat ?? '',
            AsalSekolah: d == null ? '' : d.Mhs.length === 0 ? '' : d.Mhs[0].AsalSekolah ?? '',
            RoleId: d == null ? '' : d.UserHasRoles.length > 0 ? d.UserHasRoles[0].Role.Nama ?? '' : '',
            Nama: d == null ? '' : d.Nama,
            Email: d == null ? '' : d.Email,
            Password: '',
        })), 200)
    }
})

app.post('/', async (c) => {
    const body: UserMhsInterface = await c.req.json()

    const salt = await Bycript.genSalt(12)
    const hashedPassword = await Bycript.hash(body.Password, salt)

    const user = await prisma.user.create({
        data: {
            Nama: body.Nama,
            Email: body.Email, 
            Password: hashedPassword,
            CreatedAt: new Date(),
            UpdatedAt: new Date()
        },
    })

    const role = await prisma.userHasRoles.create({
        data: {
            UserId: user.UserId, 
            RoleId: body.RoleId
        }
    })

    const mhs = await prisma.mhs.create({
        data: {
            UserId: user.UserId,
            JenisKelamin: body.JenisKelamin.match('PRIA') ? JenisKelamin.PRIA : JenisKelamin.WANITA,
            Nik: body.Nik,
            Nim: body.Nim,
            Alamat: body.Alamat,
            AsalSekolah: body.AsalSekolah
        }
    })

    return c.json<UserMhsInterface>({
        MhsId: mhs.MhsId,
        UserId: user.UserId,
        JenisKelamin: mhs.JenisKelamin,
        Nik: mhs.Nik,
        Nim: mhs.Nim,
        Alamat: mhs.Alamat,
        AsalSekolah: mhs.AsalSekolah,
        RoleId: role.RoleId,
        Nama: user.Nama,
        Email: user.Email,
        Password: ''
    }, 200)
})

app.put('/', async (c) => {
    const body: UserMhsInterface = await c.req.json()

    const user = await prisma.user.update({
        data: {
            Nama: body.Nama,
            Email: body.Email, 
            CreatedAt: new Date(),
            UpdatedAt: new Date()
        },
        where: {UserId: body.UserId}
    })
    await prisma.userHasRoles.deleteMany({where: {UserId: user.UserId}})
    const role = await prisma.userHasRoles.create({
        data: {
            UserId: user.UserId, 
            RoleId: body.RoleId
        }
    })

    const mhs = await prisma.mhs.update({
        data: {
            UserId: user.UserId,
            JenisKelamin: body.JenisKelamin.match('PRIA') ? JenisKelamin.PRIA : JenisKelamin.WANITA,
            Nik: body.Nik,
            Nim: body.Nim,
            Alamat: body.Alamat,
            AsalSekolah: body.AsalSekolah
        },
        where: {
            MhsId: body.MhsId
        }
    })

    return c.json<UserMhsInterface>({
        MhsId: mhs.MhsId,
        UserId: user.UserId,
        JenisKelamin: mhs.JenisKelamin,
        Nik: mhs.Nik,
        Nim: mhs.Nim,
        Alamat: mhs.Alamat,
        AsalSekolah: mhs.AsalSekolah,
        RoleId: role.RoleId,
        Nama: user.Nama,
        Email: user.Email,
        Password: ''
    }, 200)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    const u = await prisma.user.findFirst({select: {Mhs: {select:{MhsId: true}}}, where: {UserId: id}})

    if(u) {
        if(u.Mhs.length > 0) await prisma.mhs.delete({where: {MhsId: u.Mhs[0].MhsId}})
    }
    await prisma.user.delete({
        where: {
            UserId: id,
        },
    })

    return c.json([])
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
