import * as bcrypt from 'bcrypt';

import { DataSource, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { logUnknownError } from '@common/utils/log-error.util';

@Injectable()
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;
    this.logger.verbose(`👤 Criando novo usuário (${email})...`);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ email, password: hashedPassword });

    try {
      await this.save(user);
      this.logger.verbose(`✅ Usuário (${email}) criado com sucesso!`);
    } catch (error) {
      logUnknownError(this.logger, 'create user', { username: email }, '', error);
    }
  }
}
