import { Global, Module } from '@nestjs/common';
import { RequestContextProvider } from './express-http.context';

@Global()
@Module({
  imports: [],
  providers: [RequestContextProvider],
  exports: [RequestContextProvider],
})
export default class ContextModule {}
