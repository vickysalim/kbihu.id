import type { NextApiRequest, NextApiResponse } from "next";
import api from "@/lib/api";
import prisma from "@/lib/prisma";
import multer from "multer";
import path from "path";
import { createFolderIfNotExists } from "@/lib/folder";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const dest = "public/upload_files/pilgrims/document";
const upload = multer({ dest: dest });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  api.method(req, res, `PUT`);

  const folderPath = path.join(
    process.cwd(),
    "public",
    "upload_files",
    "pilgrims",
    "document"
  );
  createFolderIfNotExists(folderPath);

  upload.single("file")(req, res, async (error) => {
    try {
      if (!req.query.id) return api.res(res, 404, false, `ID is required`);

      const data = await prisma.user_document.findUnique({
        where: {
          id: req.query.id as string,
        },
      });

      if (!data) return api.null(res, data, `Document`);

      if (data.deleted_at) return api.null(res, data, `Document`);

      if (req.file != undefined) {
        const filePath = req.file.path;
        const originalName = req.file.originalname;

        const allowedExtensions = [".jpg", ".png", ".jpeg"];

        const fileExtension = path.extname(originalName);

        if (!allowedExtensions.includes(fileExtension)) {
          fs.unlinkSync(filePath);
          return api.res(res, 500, false, `Only images are allowed`);
        }

        const fileSize = fs.statSync(filePath).size;
        const maxSize = 5 * 1024 * 1024;

        if (fileSize > maxSize) {
          fs.unlinkSync(filePath);
          return api.res(res, 500, false, `Max size is 5MB`);
        }

        const newFileName = uuidv4();
        const finalFileName = `${newFileName}${fileExtension}`;

        const destination = path.join(folderPath, finalFileName);

        fs.rename(filePath, destination, async (error) => {
          try {
            await prisma.user_document
              .update({
                where: {
                  id: req.query.id as string,
                },
                data: {
                  submit_date:
                    new Date(req.body.submitDate) || data.submit_date,
                  description: req.body.description as string,
                  file: finalFileName,
                },
              })
              .catch((err) => {
                return api.res(res, 404, false, `Failed to update data`);
              });

            return api.res(res, 200, true, `Document updated`);
          } catch (error) {
            return api.error(res, error.message);
          }
        });
      } else {
        await prisma.user_document
          .update({
            where: {
              id: req.query.id as string,
            },
            data: {
              submit_date: new Date(req.body.submitDate) || data.submit_date,
              description: req.body.description as string,
            },
          })
          .catch((err) => {
            return api.res(res, 404, false, `Failed to update data: ${err}`);
          });

        return api.res(res, 200, true, `Document updated`);
      }
    } catch (error) {
      return api.error(res, error.message);
    }
  });
}
