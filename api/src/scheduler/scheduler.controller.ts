import {BadRequestException, Controller, Get, Ip, Param, Request} from '@nestjs/common';
import {SchedulerService} from "./scheduler.service";

@Controller('scheduler')
export class SchedulerController {
    constructor(private readonly schedulerService: SchedulerService) {
    }

    @Get("t/:trackerId")
    async triggerTracker(@Param("trackerId") trackerId: number, @Ip() ip: string, @Request() req: Request) {
        try{
            await this.schedulerService.triggerTracker(trackerId, ip, req.headers);
        }catch (e){
            throw new BadRequestException("bad input");
        }
        return "ok";
    }
}
