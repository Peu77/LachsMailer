import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import {TrackerEntity} from "./entity/Tracker.entity";

@Module({
  imports: [TrackerEntity],
  controllers: [SchedulerController],
  providers: [SchedulerService]
})
export class SchedulerModule {}
