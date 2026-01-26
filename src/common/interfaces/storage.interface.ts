import { Express } from 'express';

/**
 * Represents the metadata of a file after it has been successfully
 * processed by a storage service.
 */
export interface StoredFile {
  /**
   * The name of the storage provider used (e.g., 'filesystem').
   */
  provider: 'filesystem';

  /**
   * The relative path to the file from the storage's base directory.
   * e.g., 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6/my-file.pdf'
   */
  path: string;

  /**
   * The original name of the uploaded file.
   */
  fileName: string;

  /**
   * The size of the file in bytes.
   */
  fileSize: number;

  /**
   * The MIME type of the file (e.g., 'application/pdf').
   */
  mimeType: string;

  /**
   * The unique ID for the batch upload this file was a part of.
   */
  batchId: string;
}

/**
 * Defines the contract for a storage service. Any service (e.g., FileSystem, S3)
 * that handles file storage must implement this interface. This ensures a consistent
 * API for file handling across the application.
 */
export interface IStorageService {
  /**
   * Saves a file to the storage system.
   * @param file - The file object from Multer.
   * @param batchId - The unique identifier for the upload batch.
   * @returns A promise that resolves to the metadata of the stored file.
   */
  save(file: Express.Multer.File, batchId: string): Promise<StoredFile>;

  /**
   * Deletes a file from the storage system.
   * @param path - The relative path of the file to delete.
   * @returns A promise that resolves when the file is deleted.
   */
  delete(path: string): Promise<void>;
}
