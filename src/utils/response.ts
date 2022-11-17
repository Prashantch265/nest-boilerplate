export class SuccessResponse {
  success = true;
  status;
  data = [];
  message;
  source;
}

export class ErrorResponse {
  constructor(status: number, message: string, source: string) {
    this.status = status;
    this.message = message;
    this.source = source;
  }
  success = false;
  status;
  message;
  source;
}
