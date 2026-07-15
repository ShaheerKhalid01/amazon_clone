import {
  WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: '/admin',
  cors: { origin: '*' }, // production mein apna frontend URL yahan dein
})
export class AdminGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(AdminGateway.name);

  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  // Jab admin client connect ho — token verify karke sirf admin ko allow karein
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      const payload = this.jwtService.verify(token);
      if (payload.role !== 'ADMIN') {
        client.disconnect();
        return;
      }
      this.logger.log(`Admin connected: ${client.id}`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Admin disconnected: ${client.id}`);
  }

  // Kisi bhi relevant event par dashboard dobara calculate karke sabko bhej dein
  @OnEvent('order.created')
  @OnEvent('order.updated')
  @OnEvent('user.registered')
  @OnEvent('user.updated')
  @OnEvent('product.updated')
  async broadcastDashboardUpdate() {
    const freshStats = await this.adminService.getDashboardOverview();
    this.server.emit('dashboard:update', freshStats);
  }
}