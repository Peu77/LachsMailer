import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards
} from '@nestjs/common';
import {EmailService} from "./email.service";
import {AuthGuard} from "../auth.guard";

@Controller('email')
@UseGuards(AuthGuard)
export class EmailController {
    constructor(private emailService: EmailService) {
    }

    @Post()
    async createEmail(@Body() email: {
        from: string,
        subject: string,
        body: string
    }){
        return this.emailService.createEmail(email);
    }

    @Post(":id/target")
    async addTarget(@Body() target: {
        email: string,
        variables: {
            key: string,
            value: string
        }[]
    }, @Param("id", ParseIntPipe) id: number){
        try{
            return await this.emailService.addTarget(id, target);
        }catch (e){
            throw new BadRequestException(e.message);
        }
    }

    @Put(":id/scheduleIn/:days")
    async distributeScheduleDates(@Param("id", ParseIntPipe) id: number, @Param("days", ParseIntPipe) days: number){
        try{
            return await this.emailService.distributeScheduleDates(id, days);
        }catch (e){
            throw new BadRequestException(e.message);
        }
    }

    @Put(":id/cancel")
    async cancelSchedule(@Param("id", ParseIntPipe) id: number){
        try{
            return await this.emailService.cancelSchedule(id);
        }catch (e){
            throw new BadRequestException(e.message);
        }
    }

    @Get()
    async getEmails(){
        return this.emailService.getEmails();
    }

    @Delete(":id")
    async deleteEmail(@Param("id", ParseIntPipe) id: number){
        return this.emailService.deleteEmail(id);
    }

    @Post(":id/data")
    async setData(@Param("id", ParseIntPipe) id: number, @Body() data: {
        email: string;
        variables: { key: string; value: string }[]
    }[]){
        return this.emailService.setData(id, data);
    }
}
