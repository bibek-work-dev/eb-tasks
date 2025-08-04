// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { AuthService } from '../auth.service';
// import { Strategy } from 'passport-local';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly authService: AuthService) {
//     super({ usernameField: 'email' }); // default is username
//     console.log('here in localStrategy constructor');
//   }
//   async validate(email: string, password: string) {
//     console.log('in validate in lcoal strategy', email, password);
//     const user = await this.authService.validateUser(email, password);
//     if (!user) throw new UnauthorizedException('Invalid email or password');
//     return user;
//   }
// }
