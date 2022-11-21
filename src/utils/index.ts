export interface successResponse {
  success: true;
  source: string | [string];
  data: any;
  message: string;
  status: number;
}

export interface errorResponse {
  success: false;
  message: string;
  status: number;
  description: any;
}
