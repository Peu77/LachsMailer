import {BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post} from '@nestjs/common';
import {EmailService} from "./email.service";

@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService) {
    }

    @Post()
    async createEmail(@Body() email: {
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
            return this.emailService.addTarget(id, target);
        }catch (e){
            throw new BadRequestException(e.message);
        }
    }

    @Get()
    async getEmails(){
        return this.emailService.getEmails();
    }
}
