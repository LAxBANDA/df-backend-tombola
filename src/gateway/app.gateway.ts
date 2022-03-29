import { Socket,Server } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import { UserService } from 'src/user/user.service';
import * as cookie from 'cookie'
import { RewardService } from 'src/reward/reward.service';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayConnection{
    constructor(
        private readonly userService: UserService, 
        private readonly rewardService: RewardService,
        private readonly authService: AuthService
        ) {

    }

    @WebSocketServer() socketServer: Server
    
    afterInit(server: any) {
        console.log('initialized')
    }

    async handleConnection(client: any, ...args: any[]) {
        console.log('handleConnection')
        const accessToken = this.getAccessToken(client.handshake.headers.cookie);

        if(!accessToken){
            return null
        }

        const jwtUser = await this.authService.verify(accessToken);

        if(!jwtUser){
            return null;
        }
        
        const user = await this.userService.findUserByEmail(jwtUser.username);
        
        const credit = await this.rewardService.checkReward(user);
        
        this.socketServer.emit('userConnected', { ...user, credit });
    }

    /**
     * Función ejecutada cuando se cierra la comunicación entre cliente y servidor
     * @param client el socket client
     * @returns 
     */
    async handleDisconnect(client: Socket): Promise<number>{
        console.log('handleDisconnect')
        const accessToken = this.getAccessToken(client.handshake.headers.cookie);

        if(!accessToken){
            return null;
        }

        const user = await this.authService.verify(accessToken);

        if(!user){
            return null;
        }

        const { last_connection } = await this.userService.updateLastConnection(user.username, Date.now());

        return last_connection;
    }

    /**
     * Función para obtener access_token desde cookies
     * @param cookies Cookies provenientes del request
     * @returns {string} access_token JWT
     */
    getAccessToken(cookies: string): string {

        if(!cookies){
            return null;
        }

        const cookiesObject = cookie.parse(cookies);

        if(!cookiesObject.access_token){
            return null;
        }

        return cookiesObject.access_token;
    }
}