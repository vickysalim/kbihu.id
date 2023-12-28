import type { NextApiRequest, NextApiResponse } from 'next'
import api from '@/lib/api'
import prisma from '@/lib/prisma'
import multer from 'multer'
import path from 'path'
import { createFolderIfNotExists } from '@/lib/folder'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const dest = 'public/upload_files/profile_pic'
const upload = multer({ dest: dest })

export const config = {
    api: {
      bodyParser: false,
    },
  };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    api.method(req, res, `PUT`)

    const folderPath = path.join(process.cwd(), 'public', 'upload_files', 'profile_pic');
    createFolderIfNotExists(folderPath);

    upload.single('file')(req, res, async (error) => {
        try {
            if(!req.query.id) return api.res(res, 404, false, `ID is required`)

            const data = await prisma.company.findUnique({
                where: {
                    id: req.query.id as string,
                    deleted_at: null
                }
            })
    
            if(!data) return api.null(res, data, `Company`)

            const filePath = req.file.path
            const originalName = req.file.originalname

            const allowedExtensions = ['.jpg', '.png', '.jpeg']

            const fileExtension = path.extname(originalName);

            if(!allowedExtensions.includes(fileExtension)) {
                fs.unlinkSync(filePath)
                return api.res(res, 500, false, `Only images are allowed`)
            }

            const fileSize = fs.statSync(filePath).size;
            const maxSize = 5 * 1024 * 1024;

            if(fileSize > maxSize) {
                fs.unlinkSync(filePath)
                return api.res(res, 500, false, `Max size is 5MB`)
            }

            const newFileName = uuidv4();
            const finalFileName = `${newFileName}${fileExtension}`;

            const destination = path.join(folderPath, finalFileName);

            fs.rename(filePath, destination, async (error) => {
                try {
                    await prisma.company.update({
                        where: {
                            id: req.query.id as string
                        },
                        data: {
                            company_logo: finalFileName,
                            updated_at: new Date()
                        }
                    }).catch((err) => {
                        return api.res(res, 404, false, `Failed to update data`)
                    })
            
                    return api.res(res, 200, true, `Company updated`)
                } catch (error) {
                    return api.error(res, error.message)
                }
            })
        } catch (error) {
            return api.error(res, error.message)
        }
    })
}