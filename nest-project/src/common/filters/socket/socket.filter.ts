import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class SocketFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const client: Socket = host.switchToWs().getClient<Socket>();

    let message = 'Unexpected Error';

    console.log('exception ', exception);

    if (exception instanceof WsException) {
      const error = exception.getError();
      message = typeof error === 'string' ? error : JSON.stringify(error);
    } else if (
      typeof exception === 'object' &&
      exception !== null &&
      'message' in exception
    ) {
      message =
        typeof exception.message === 'string'
          ? exception.message
          : JSON.stringify(exception.message);
    }
    client.emit('error', { success: false, message });
  }
}
