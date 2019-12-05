import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [UsersModule, PassportModule,
            JwtModule.register({
                secret: jwtConstants.secret
            })],
    providers: [AuthenticationService, LocalStrategy, JwtStrategy],
    exports: [AuthenticationService, JwtModule]
})
export class AuthenticationModule {}
