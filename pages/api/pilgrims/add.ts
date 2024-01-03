import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import api from '@/lib/api'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'

const validation = z.object({
    departure_year: z.coerce.number().min(2000, { message: `Tahun keberangkatan wajib dimasukkan` }).max(3000, { message: `Tahun keberangkatan wajib dimasukkan` }),
    reg_number: z.string().optional(),
    portion_number: z.string().min(1, { message: `Nomor porsi wajib dimasukkan` }),
    bank: z.string().min(1, { message: `Nama bank wajib dimasukkan` }),
    bank_branch: z.string().optional(),
    name: z.string().min(1, { message: `Nama wajib dimasukkan` }),
    nasab_name: z.string().min(1, { message: `Bin/Binti wajib dimasukkan` }),
    gender: z.string().min(1, { message: `Jenis kelamin wajib dimasukkan` }),
    marital_status: z.string().optional(),
    blood_type: z.string().optional(),
    pob: z.string().min(1, { message: `Tempat lahir wajib dimasukkan` }),
    dob: z.string().min(1, { message: `Tanggal lahir wajib dimasukkan` }),
    street: z.string().min(1, { message: `Alamat wajib dimasukkan` }),
    postal_code: z.coerce.number().min(1, { message: `Kode pos wajib dimasukkan` }),
    subdistrict: z.string().min(1, { message: `Kelurahan wajib dimasukkan` }),
    district: z.string().min(1, { message: `Kecamatan wajib dimasukkan` }),
    city: z.string().min(1, { message: `Kota wajib dimasukkan` }),
    province: z.string().min(1, { message: `Provinsi wajib dimasukkan` }),
    education: z.string().optional(),
    job: z.string().optional(),
    passport_number: z.string().min(1, { message: `Nomor paspor wajib dimasukkan` }),
    passport_name: z.string().min(1, { message: `Nama paspor wajib dimasukkan` }),
    passport_pob: z.string().min(1, { message: `Tempat lahir paspor wajib dimasukkan` }),
    passport_dob: z.string().min(1, { message: `Tanggal lahir paspor wajib dimasukkan` }),
    passport_issue_date: z.string().min(1, { message: `Tanggal terbit paspor wajib dimasukkan` }),
    passport_expiry_date: z.string().min(1, { message: `Tanggal berakhir paspor wajib dimasukkan` }),
    passport_issue_office: z.string().min(1, { message: `Kantor terbit paspor wajib dimasukkan` }),
    passport_endorsement: z.string().optional(),
    identity_number: z.string().min(1, { message: `Nomor KTP wajib dimasukkan` }),
    phone_number: z.string().min(1, { message: `Nomor telepon wajib dimasukkan` }),
    username: z.string().min(1, { message: `Username wajib dimasukkan` }),
    password: z.string().min(1, { message: `Password wajib dimasukkan` }),
    company_id: z.string().min(1, { message: `KBIHU tidak valid` }),
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
              username: reqBody.portion_number
            },
        })

        api.exist(res, userExist, 'Username')

        const companyValid = await prisma.company.findUnique({
            where: {
                id: reqBody.company_id
            }
        })

        if(!userExist && companyValid) {
            const user_account = await prisma.user_account.create({
                data: {
                    id: uuidv4(),
                    username: reqBody.username,
                    password: await bcrypt.hash(reqBody.password, 10),
                    phone_number: reqBody.phone_number,
                    role: 'User',
                    company_id: companyValid.id
                },
            })
    
            const user_profile = await prisma.user_profile.create({
                data: {
                    id: uuidv4(),
                    user_account_id: user_account.id,
                    departure_year: reqBody.departure_year,
                    reg_number: reqBody.reg_number,
                    portion_number: reqBody.portion_number,
                    bank: reqBody.bank,
                    bank_branch: reqBody.bank_branch,
                    name: reqBody.name,
                    nasab_name: reqBody.nasab_name,
                    gender: reqBody.gender,
                    marital_status: reqBody.marital_status,
                    blood_type: reqBody.blood_type,
                    pob: reqBody.pob,
                    dob: new Date(reqBody.dob),
                    street: reqBody.street,
                    postal_code: reqBody.postal_code,
                    subdistrict: reqBody.subdistrict,
                    district: reqBody.district,
                    city: reqBody.city,
                    province: reqBody.province,
                    education: reqBody.education,
                    job: reqBody.job,
                    passport_number: reqBody.passport_number,
                    passport_name: reqBody.passport_name,
                    passport_pob: reqBody.passport_pob,
                    passport_dob: new Date(reqBody.passport_dob),
                    passport_issue_date: new Date(reqBody.passport_issue_date),
                    passport_expiry_date: new Date(reqBody.passport_expiry_date),
                    passport_issue_office: reqBody.passport_issue_office,
                    passport_endorsement: reqBody.passport_endorsement,
                    identity_number: reqBody.identity_number,
                }
            })

            return api.res(res, 200, true, `Successfully add new jemaah`, { user_account, user_profile })
        }
    } catch (error) {
        return api.error(res, error.message)
    }
}