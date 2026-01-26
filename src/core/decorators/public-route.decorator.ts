import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ROUTE = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_ROUTE, true);
