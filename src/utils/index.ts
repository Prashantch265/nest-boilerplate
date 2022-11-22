/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-22 22:58:44
 * @Last Modified by:   prashant.chaudhary
 * @Last Modified time: 2022-11-22 22:58:44
 */

export interface successResponse {
  success: true;
  source: string | [string];
  data: any;
  message: string;
  status: number;
}

export interface errorResponse {
  success: false;
  source?: string | [string];
  message: string;
  status: number;
  description: any;
}
