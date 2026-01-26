import { Injectable } from '@nestjs/common';
import { StorageEngine } from 'multer';
import { IStorageService } from '../../common/interfaces/storage.interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * A custom Multer storage engine that delegates file handling to an IStorageService.
 * It ensures all files within a single request share the same 'batchId'.
 */
@Injectable()
export class CustomStorageEngine implements StorageEngine {
  constructor(private readonly storageService: IStorageService) {
    if (!storageService) {
      throw new Error('IStorageService is required for CustomStorageEngine.');
    }
  }

  /**
   * Handles the incoming file stream from Multer.
   * It generates a unique batchId once per request and uses it for all files.
   *
   * @param req The Express request object.
   * @param file The file stream from Multer.
   * @param cb The callback to signal completion or error.
   */
  _handleFile(
    req: any,
    file: Express.Multer.File,
    cb: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): void {
    // Generate a batchId only once for the entire request (for the first file).
    if (!req.batchId) {
      req.batchId = uuidv4();
    }

    const chunks: Buffer[] = [];
    file.stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    file.stream.on('end', () => {
      // Use an IIFE (Immediately Invoked Function Expression) to handle the async
      // logic without making the event listener itself async. This resolves the
      // `@typescript-eslint/no-misused-promises` linting issue.
      (async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const multerFile: Express.Multer.File = {
            ...file,
            buffer,
            size: buffer.length,
          };

          // Delegate the saving logic, passing the request-specific batchId.
          const storedFile = await this.storageService.save(
            multerFile,
            req.batchId,
          );

          cb(null, storedFile);
        } catch (error) {
          cb(error);
        }
      })(); // Immediately invoke the async function
    });

    file.stream.on('error', (err) => {
      cb(err);
    });
  }

  /**
   * Handles the removal of a file in case of an error during the request.
   *
   * @param req The Express request object.
   * @param file The file object, which includes the path from `_handleFile`.
   * @param cb The callback to signal completion.
   */
  _removeFile(
    req: any,
    file: Express.Multer.File & { path: string },
    cb: (error: Error | null) => void,
  ): void {
    this.storageService
      .delete(file.path)
      .then(() => cb(null))
      .catch((err) => cb(err));
  }
}
