import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileSystemStorageService } from './filesystem-storage.service';

/**
 * A module for handling file storage operations.
 *
 * It provides the `IStorageService`, which abstracts the underlying storage
 * mechanism (e.g., local filesystem, S3). This module is marked as global
 * so that the `IStorageService` is available for injection in any other
 * module without needing to import `StorageModule` everywhere.
 *
 * It's configured to use the `FileSystemStorageService` as the concrete
 * implementation for the `IStorageService` token.
 */
@Global()
@Module({
  imports: [ConfigModule], // Ensures ConfigService is available.
  providers: [
    {
      provide: 'IStorageService',
      useClass: FileSystemStorageService,
    },
  ],
  exports: ['IStorageService'], // Export the token for dependency injection.
})
export class StorageModule {}
