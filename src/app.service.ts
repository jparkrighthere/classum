import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Classum-Jeonghyeon Park Backend Assignment Server immidang~';
  }
}
