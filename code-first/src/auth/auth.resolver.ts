import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/users/users.model';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';

@ObjectType()
export class MessageResponse {
  @Field()
  message: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  user: User;
}

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => User)
  async registerUser(@Args('input') registerUserInput: RegisterUserInput) {
    console.log('createUserInput', registerUserInput);
    const newlyCreatedUser =
      await this.authService.registerUser(registerUserInput);
    return newlyCreatedUser;
  }

  @Mutation(() => LoginResponse)
  async loginUser(@Args('input') loginUserInput: LoginUserInput) {
    console.log('loginUserInput', loginUserInput);
    const loggedInUser = await this.authService.loginUser(loginUserInput);
    return loggedInUser;
  }

  @Mutation(() => MessageResponse)
  async logoutUser() {
    const logoutUser = await this.authService.logoutUser();
    return { message: 'Logged Out successfully' };
  }
}
