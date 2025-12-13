import { ResponseMessages } from 'src/common/enums/ResponseMessages.enum';

export class BaseResponse<T> {
  data: T;
  success: boolean;
  message: string;

  constructor(
    data: T,
    message: ResponseMessages = ResponseMessages.SUCCESS,
    success: boolean,
  ) {
    this.data = data;
    this.message = message;
    this.success = success;
  }
}
