import * as bcrypt from 'bcrypt';

import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.verbose(`‼️ User not found!)`);
      throw new NotFoundException('User not found!');
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = this.jwtService.sign(payload);

      this.logger.verbose(`✅ User (${user.id} signed in successfully!)`);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
