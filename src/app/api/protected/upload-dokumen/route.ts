import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import fs from 'fs'
import path from 'path'
import mime from 'mime'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { FileMhs } from '@/generated/prisma'

const app = new Hono().basePath('/api/protected/upload-dokumen')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const filename = c.req.query('file')

        if (!filename) {
            return c.json(
                { data: [], status: 'error', message: 'file is required' },
                { status: 400 }
            )
        }
        const filePath = path.join(process.cwd(), 'tmp', 'files', filename)
    
        try {
            const stat = fs.statSync(filePath)
            if (!stat.isFile()) {
                return c.json(
                    { data: [], status: 'error', message: 'not a file' },
                    { status: 400 }
                )
            }
    
            const fileStream = fs.createReadStream(filePath)
            const contentType = mime.getType(filePath) || 'application/octet-stream'
    
            return c.body(fileStream as any, 200, {
                'Content-Type': contentType,
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'error'
            return c.json(
                { data: [], status: 'error', message: errorMessage },
                { status: 500 }
            )
        }
    
})

app.post('/', async (c) => {
    const body = await c.req.parseBody()
    
    const file = body.files
    const MhsId = body.MhsId as string
    const FileId = body.FileId as string

    if (!file || !(file instanceof File)) {
        return c.json(
            { status: 'error', message: 'File is required', data: [] },
            { status: 400 }
        )
    }

    if (!MhsId) {
        return c.json(
            { status: 'error', message: 'Mhs Perlu diisi', data: [] },
            { status: 400 }
        )
    }
    
    if (!FileId) {
        return c.json(
            { status: 'error', message: 'Id File Perlu diisi', data: [] },
            { status: 400 }
        )
    }

    const MAX_SIZE_MB = 10
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return c.json(
            {
                status: 'error',
                message: 'Ukuran file melebihi 10MB',
                data: [],
            },
            { status: 400 }
        )
    }

    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const allowedExtensions = ['pdf', 'doc', 'docx']

    const fileExt = mime.getExtension(file.type) || ''
    if (
        !allowedMimeTypes.includes(file.type) ||
        !allowedExtensions.includes(fileExt)
    ) {
        return c.json(
            {
                status: 'error',
                message:
                    'Format file tidak valid. Hanya PDF dan Word (doc/docx) yang diperbolehkan.',
                data: [],
            },
            { status: 400 }
        )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${uuidv4()}.${fileExt}`
    const dir = path.join(process.cwd(), 'tmp', 'files')

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    const filePath = path.join(dir, filename)

    fs.writeFileSync(filePath, buffer)

    const data = await prisma.fileMhs.create({
        data: {
            FileId: FileId,
            MhsId: MhsId,
            Nama: filename,
        },
    });

    return c.json<FileMhs>({
        FileMhsId: data.FileMhsId,
        FileId: data.FileId,
        MhsId: data.MhsId,
        Nama: data.Nama
    }, 200)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    const file = await prisma.fileMhs.findFirst({
        where: {
            FileMhsId: id,
        },
        select: {
            Nama: true,
        },
    })

    const avatarDir = path.join(process.cwd(), 'tmp', 'files')

    if (file !== null) {
        const oldPath = path.join(avatarDir, file.Nama || '')
        if (fs.existsSync(oldPath)) {
            try {
                fs.unlinkSync(oldPath)
            } catch (err) {
                console.error('Failed to delete file :', err)
            }
        }
    }
    
    await prisma.fileMhs.delete({
        where: {
            FileMhsId: id,
        },
    })


    return c.json(null, 200)
})


export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)