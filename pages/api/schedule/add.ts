import type { NextApiRequest, NextApiResponse } from "next";
import api from "@/lib/api";
import prisma from "@/lib/prisma";
import multer from "multer";
import path from "path";
import { createFolderIfNotExists } from "@/lib/folder";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const dest = "public/upload_files/schedule";
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
  api.method(req, res, `POST`);

  const folderPath = path.join(
    process.cwd(),
    "public",
    "upload_files",
    "schedule"
  );
  createFolderIfNotExists(folderPath);

  upload.single("file")(req, res, async (error) => {
    try {
      if (!req.body.id || !req.body.year)
        return api.res(res, 404, false, `All fields required`);

      const data = await prisma.company.findUnique({
        where: {
          id: req.body.id as string,
          deleted_at: null,
        },
      });

      if (!data) return api.null(res, data, `Company`);

      const schedule = await prisma.company_simulation_schedule.findFirst({
        where: {
          company_id: data.id as string,
          year: parseInt(req.body.year),
          deleted_at: null,
        },
      });

      if (schedule) return api.exist(res, schedule, `Schedule`);

      if (req.file != undefined) {
        const filePath = req.file.path;
        const originalName = req.file.originalname;

        const allowedExtensions = [".pdf"];

        const fileExtension = path.extname(originalName);

        if (!allowedExtensions.includes(fileExtension)) {
          fs.unlinkSync(filePath);
          return api.res(res, 500, false, `Only pdf file are allowed`);
        }

        const fileSize = fs.statSync(filePath).size;
        const maxSize = 20 * 1024 * 1024;

        if (fileSize > maxSize) {
          fs.unlinkSync(filePath);
          return api.res(res, 500, false, `Max size is 20MB`);
        }

        const newFileName = uuidv4();
        const finalFileName = `${newFileName}${fileExtension}`;

        const destination = path.join(folderPath, finalFileName);

        fs.rename(filePath, destination, async (error) => {
          try {
            await prisma.company_simulation_schedule
              .create({
                data: {
                  id: uuidv4(),
                  company_id: data.id as string,
                  file: finalFileName,
                  year: parseInt(req.body.year),
                  amount: parseInt(req.body.amount),
                },
              })
              .catch((err) => {
                return api.res(res, 404, false, `Failed to add data: ${err}`);
              });

            return api.res(res, 200, true, `Created new schedule data`);
          } catch (error) {
            return api.error(res, error.message);
          }
        });
      } else {
        return api.res(res, 404, false, `File not found`);
      }
    } catch (error) {
      return api.error(res, error.message);
    }
  });
}
