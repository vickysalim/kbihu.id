import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import api from '@/lib/api'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const validation = z.object({
    id: z.string().min(1, { message: `ID is required` })
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    api.method(req, res, `DELETE`)

    try {
        const reqBody = validation.parse(req.body)

        await prisma.company.delete({
            where: {
                id: reqBody.id
            }
        }).catch((err) => {
            return api.res(res, 404, false, `Company not found`)
        })

        return api.res(res, 200, true, `Company deleted`)
    } catch (error) {
        if(error instanceof z.ZodError) {
            const validation = error.errors.map((error) => ({
                field: error.path[0],
                message: error.message
            }))

            return api.invalid(res, validation)
        } else {
            return api.error(res, error.message)
        }
    }
}