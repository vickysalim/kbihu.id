import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import api from '@/lib/api'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    api.method(req, res, `OPTIONS`)

    try {
        const user = await prisma.user_account.count()

        if(!user) {
            const user = await prisma.user_account.create({
                data: {
                    id: uuidv4(),
                    username: 'admin',
                    password: await bcrypt.hash('12345678', 10),
                    phone_number: '-',
                    role: 'Superadmin',
                }
            })

            return api.res(res, 200, true, `Successfully add superadmin account`, user)
        } else return api.res(res, 409, false, `Superadmin account already exist`)
    } catch (error) {
        return api.error(res, error.message)
    }
}
