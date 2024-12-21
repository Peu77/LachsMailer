import { Module } from '@nestjs/common';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';
import {SessionEntity, SubmissionEntity, TrackerEntity, TrackerKeyDownEntity} from "./entity/Tracker.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {EmailModule} from "../email/email.module";

@Module({
  imports: [TypeOrmModule.forFeature([TrackerEntity,SessionEntity, TrackerKeyDownEntity, SubmissionEntity]), EmailModule],
  controllers: [TrackerController],
  providers: [TrackerService]
})
export class TrackerModule {

}
