import { Injectable } from '@nestjs/common';
import { RegisterUserInput } from './dto/register-user.input';
import { GraphQLError } from 'graphql';
import { LoginUserInput } from './dto/login-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import { TokenService } from 'src/commons/token.service';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(
    registerUserInput: RegisterUserInput,
  ): Promise<UserDocument> {
    const { email, password, username } = registerUserInput;
    const alreadyExists = await this.userModel.findOne({ email });
    if (alreadyExists)
      throw new GraphQLError('The email is already registered');
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await this.userModel.create({
      ...registerUserInput,
      password: hashedPassword,
    });
    console.log('newUser', newUser);

    return newUser;
  }

  async loginUser(
    loginUserInput: LoginUserInput,
  ): Promise<{ user: UserDocument; accessToken; refreshToken }> {
    const { email, password } = loginUserInput;
    const alreadyExists = await this.userModel.findOne({ email });
    console.log('alreadyExists', alreadyExists);
    if (!alreadyExists)
      throw new GraphQLError("The email isn't registered at all");
    const passwordMatch = await bcryptjs.compare(
      password,
      alreadyExists.password,
    );

    console.log('Password Match', passwordMatch);

    if (!passwordMatch) {
      throw new GraphQLError('Incorrect password');
    }

    const payload = { sub: alreadyExists._id, email: alreadyExists.email };

    const accessToken = this.tokenService.createAccessToken(payload);
    const refreshToken = this.tokenService.createRefreshToken(payload);
    alreadyExists.refreshToken = refreshToken;
    await alreadyExists.save();

    return { user: alreadyExists, accessToken, refreshToken };
  }

  async logoutUser() {}
}
