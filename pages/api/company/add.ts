import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import api from '@/lib/api'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'

const validation = z.object({
    name: z.string().min(1, { message: `Nama KBIHU wajib dimasukkan` }),
    street: z.string().min(1, { message: `Alamat wajib dimasukkan` }),
    district: z.string().min(1, { message: `Kecamatan wajib dimasukkan` }),
    subdistrict: z.string().min(1, { message: `Kelurahan wajib dimasukkan` }),
    city: z.string().min(1, { message: `Kota wajib dimasukkan` }),
    province: z.string().min(1, { message: `Provinsi wajib dimasukkan` }),
    postal_code: z.coerce.number().min(1, { message: `Kode pos wajib dimasukkan` }),
    phone_number: z.string().min(1, { message: `Nomor telepon wajib dimasukkan` }),
    leader: z.string().min(1, { message: `Pimpinan wajib dimasukkan` }),
    license: z.string().min(1, { message: `Nomor izin wajib dimasukkan` }),
    username: z.string().min(1, { message: `Username wajib dimasukkan` }),
    password: z.string().min(1, { message: `Password wajib dimasukkan` }),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    api.method(req, res, `POST`)

    try {
        const reqBody = validation.parse(req.body)

        const userExist = await prisma.user_account.findUnique({
            where: {
              username: reqBody.username
            },
        })

        api.exist(res, userExist, 'Username')

        if(!userExist) {
            const company = await prisma.company.create({
                data: {
                    id: uuidv4(),
                    name: reqBody.name,
                    street: reqBody.street,
                    district: reqBody.district,
                    subdistrict: reqBody.subdistrict,
                    city: reqBody.city,
                    province: reqBody.province,
                    postal_code: reqBody.postal_code,
                    phone_number: reqBody.phone_number,
                    leader: reqBody.leader,
                    license: reqBody.license,
                },
            })
    
            const user = await prisma.user_account.create({
                data: {
                    id: uuidv4(),
                    username: reqBody.username,
                    password: await bcrypt.hash(reqBody.password, 10),
                    phone_number: reqBody.phone_number,
                    role: 'Admin',
                    company_id: company.id
                }
            })

            return api.res(res, 200, true, `Successfully add new company`, { company, user })
        }
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
