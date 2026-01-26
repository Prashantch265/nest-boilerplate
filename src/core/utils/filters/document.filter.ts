import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

export default function (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) {
  const allowedDocumentFormats = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  if (!allowedDocumentFormats.includes(file.mimetype)) {
    return callback(new BadRequestException('Unsupported Document Format'));
  }

  callback(null, true);
}
