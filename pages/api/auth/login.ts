import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'
import api from '@/lib/api'
import prisma from '@/lib/prisma'

const validation = z.object({
    username: z.string().min(1, { message: `Username is required` }),
    password: z.string().min(1, { message: `Password is required` })
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    api.method(req, res, `POST`)

    try {
        const reqBody = validation.parse(req.body)

        const data = await prisma.user_account.findUnique({
            where: {
                username: reqBody.username
            }
        })

        if(!data) {
            return api.res(res, 404, false, `Username not found`)
        }

        if(data.deleted_at) {
            return api.res(res, 404, false, `Username not found`)
        }

        const matchPassword = await bcrypt.compare(reqBody.password, data.password)

        if(!matchPassword) {
            return api.res(res, 400, false, `Password is incorrect`)
        }

        const token = jwt.sign(
            { id: data.id },
            process.env.JWT_SECRET as Secret,
            { expiresIn: `365d` }
        )

        return api.res(res, 200, true, `Login success`, { token })

    } catch (error: any) {
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