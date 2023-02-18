import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Socket, io } from 'socket.io-client';

@Injectable()
export class SocketIoClientProvider {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  private socket: Socket;

  private connect() {
    this.socket = io(
      'wss://tipsscore.com:2083/app/7UXH2sNFqpVAO6FebyTKpujgfy8BUnM?protocol=7&client=js&version=5.0.3&flash=false',
      {
        transports: ['websocket'],
        rejectUnauthorized: false,
        secure: false,
      },
    );
    this.subscribeToChannel('en-football-list');
    // setInterval(this.sendPing, 15000);
    return this.socket;
  }

  getSocket = () => {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  };

  subscribeToChannel = (channel) => {
    this.socket.send({ event: 'pusher:subscribe', data: { channel: channel } });
  };
  sendPing = () => {
    console.log('status: ', this.socket.connected);
    this.socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    this.socket.send({ event: 'pusher:ping', data: {} });
  };
}
