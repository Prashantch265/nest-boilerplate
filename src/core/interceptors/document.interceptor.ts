import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IStorageService } from '../../common/interfaces/storage.interface';
import { CustomStorageEngine } from '../storage/custom-engine.storage';
import documentFilter from '../utils/filters/document.filter';

/**
 * A custom interceptor that properly injects the IStorageService
 * into the CustomStorageEngine for document uploads.
 */
@Injectable()
export class DocumentInterceptor implements NestInterceptor {
  private readonly filesInterceptor: NestInterceptor;

  constructor(@Inject('IStorageService') storageService: IStorageService) {
    // Create an instance of the FilesInterceptor and configure it here.
    // Because this is inside a NestJS injectable class, we have access
    // to the storageService via dependency injection.
    const interceptor = FilesInterceptor('files', undefined, {
      storage: new CustomStorageEngine(storageService),
      fileFilter: documentFilter,
      //   limits: {
      //     fileSize: 10 * 1024 * 1024, // 10MB file limit
      //   },
    });

    // We need to create an instance of the returned class
    this.filesInterceptor = new interceptor();
  }

  /**
   * This method is called by NestJS to execute the interceptor.
   * It delegates the call to the underlying FilesInterceptor instance.
   */
  intercept(context: ExecutionContext, next: CallHandler) {
    return this.filesInterceptor.intercept(context, next);
  }
}
