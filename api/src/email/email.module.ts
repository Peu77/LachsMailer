import {Module} from '@nestjs/common';
import {EmailController} from './email.controller';
import {EmailService} from './email.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {EmailEntity} from "./entity/Email.entity";
import {TargetEntity, TargetVariableEntity} from "./entity/Target.entity";

@Module({
    imports: [TypeOrmModule.forFeature([EmailEntity, TargetEntity, TargetVariableEntity])],
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {
}
