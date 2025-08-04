import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/users/users.model';
import { RegisterUserInput } from './dtos/register-user.input';
import { LoginUserInput } from './dtos/login-user.input';
import { LoginUserResponse } from './responses/login_user.response';
import { RegisterUserResponse } from './responses/register_user.response';
import { CurrentUser } from 'src/commons/decorators/current_user/current_user.decorator';
import { AccessTokenPayload } from 'src/commons/types/token-payload.types';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterUserResponse)
  async registerUser(@Args('input') registerUserInput: RegisterUserInput) {
    console.log('registerUserInput', registerUserInput);
    const result = await this.authService.register(registerUserInput);
    return { user: result };
  }

  @Mutation(() => LoginUserResponse)
  async loginUser(@Args('input') loginUserInput: LoginUserInput) {
    console.log('loginUserInput', loginUserInput);
    const result = await this.authService.login(loginUserInput);
    console.log('result in loginUserResponse', result);
    return result;
  }

  @Mutation(() => LogoutResponse)
  async logoutUser(@CurrentUser() user: AccessTokenPayload)
}
