import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import {EmailEntity} from "./entity/Email.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EmailEntity])],
  controllers: [EmailController],
  providers: [EmailService]
})
export class EmailModule {}
