import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/categories/category.module';
import { Module } from '@nestjs/common';
import { TransactionModule } from './modules/transactions/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/auth/user.entity';
import { configValidationSchema } from './config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE || 'dev'}`],
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}', User],
      }),
    }),
    TransactionModule,
    CategoryModule,
    AuthModule,
  ],
})
export class AppModule {}
