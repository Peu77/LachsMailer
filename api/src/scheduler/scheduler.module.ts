import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import {TrackerEntity} from "./entity/Tracker.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {EmailModule} from "../email/email.module";

@Module({
  imports: [TypeOrmModule.forFeature([TrackerEntity]), EmailModule],
  controllers: [SchedulerController],
  providers: [SchedulerService]
})
export class SchedulerModule {

}
