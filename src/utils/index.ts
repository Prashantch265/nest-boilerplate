import util from 'util';
import { ErrorResponse, SuccessResponse } from './response';
import successMsg from './messages/message.json';
import { Response } from 'express';

export const successResponse = (
  res: Response,
  data: any,
  message: string,
  source: string,
) => {
  if (!data) throw new Error(`Data required to send response to client`);

  const success = new SuccessResponse();
  success.source = source;
  success.data = data;
  success.message = util.format(successMsg[message], source);
  success.status = 200;

  return res.json(success);
};

export const errorResponse = (
  status: number,
  message: string,
  source: string,
) => {
  if (!status) throw new Error(`http code not found`);
  if (!message) throw new Error(`Message Required to send to client`);

  const error = new ErrorResponse(status, message, source);

  return error;
};
