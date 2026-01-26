import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { ContextService } from './context.service';

@Global() // Make the ContextService available application-wide
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        // Automatically mount the middleware to store context for all routes
        mount: true,
      },
    }),
  ],
  providers: [ContextService],
  exports: [ContextService],
})
export class ContextModule {}
