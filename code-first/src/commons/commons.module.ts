import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { AuthGuard } from './guards/auth/auth.guard';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [TokenService, AuthGuard],
  exports: [TokenService, AuthGuard],
})
export class CommonsModule {}
