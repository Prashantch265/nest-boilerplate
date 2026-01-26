import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  IStorageService,
  StoredFile,
} from '../../common/interfaces/storage.interface';

@Injectable()
export class FileSystemStorageService implements IStorageService {
  private readonly logger = new Logger(FileSystemStorageService.name);
  private readonly baseDir: string;

  constructor(private readonly configService: ConfigService) {
    this.baseDir = path.join(
      process.cwd(),
      this.configService
        .get<string>('storage.filesystem.baseDir', 'uploads')
        ?.trim(),
    );

    if (!this.baseDir) {
      throw new Error('FileSystem base directory is not configured.');
    }
  }

  /**
   * Saves a file to the local filesystem within a directory named after the batchId.
   *
   * @param file The Multer file object.
   * @param batchId The unique ID for the entire upload request.
   * @returns A promise resolving to the stored file's metadata.
   */
  async save(file: Express.Multer.File, batchId: string): Promise<StoredFile> {
    try {
      // Construct the relative path for the file using the batchId.
      const relativePath = path.join(batchId, file.originalname);
      const fullPath = path.join(this.baseDir, relativePath);

      // Ensure the destination directory (the batchId folder) exists.
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      // Write the file buffer to the destination.
      await fs.writeFile(fullPath, file.buffer);

      this.logger.log(`File saved successfully to ${fullPath}`);

      const storedFile: StoredFile = {
        provider: 'filesystem',
        path: relativePath,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        batchId: batchId,
      };

      return storedFile;
    } catch (error) {
      this.logger.error(
        `Failed to save file: ${file.originalname}`,
        error.stack,
      );
      throw new Error(`Could not save file: ${error.message}`);
    }
  }

  /**
   * Deletes a file from the local filesystem.
   * @param filePath The relative path of the file to delete.
   * @returns A promise that resolves when the file is deleted.
   */
  async delete(filePath: string): Promise<void> {
    try {
      const fullPath = path.join(this.baseDir, filePath);

      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        // Delete folder recursively
        await fs.rm(fullPath, { recursive: true, force: true });
        this.logger.log(`Directory deleted successfully: ${fullPath}`);
      } else {
        // Delete a single file
        await fs.unlink(fullPath);
        this.logger.log(`File deleted successfully: ${fullPath}`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.logger.error(`Failed to delete: ${filePath}`, error.stack);
        throw new Error(`Could not delete file or directory: ${error.message}`);
      }
    }
  }
}
