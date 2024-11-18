import { TokenService } from '@app/auth-lib/token';
import { Logger, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private tokenService: TokenService) {}
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client with id: ${client.id} connected`);
    this.logger.log(`Number of connected clients: ${sockets.size}`);

    try {
      const authHeader = client.handshake.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException();
      }

      const [, accessToken] = authHeader.split(' ');
      const { sub } = await this.tokenService.verifyToken(accessToken);
      client.data.userId = sub;
      client.join(sub);
    } catch (error) {
      this.logger.error(error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client with id: ${client.id} disconnected`);
  }

  async sendNotification(userId: string, event: string, data: unknown) {
    this.io.to(userId).emit(event, { data });
  }
}
