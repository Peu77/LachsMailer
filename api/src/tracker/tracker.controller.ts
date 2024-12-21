import {BadRequestException, Body, Controller, Get, Ip, Param, ParseIntPipe, Post, Request} from '@nestjs/common';
import {TrackerService} from "./tracker.service";

@Controller('tracker')
export class TrackerController {
    constructor(private readonly schedulerService: TrackerService) {
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

    @Post("pressKey/:trackerId")
    async pressKey(@Param("trackerId", ParseIntPipe) trackerId: number, @Body() body: {key: string}) {
        try{
            await this.schedulerService.pressKey(trackerId, body.key);
        }catch (e){
            throw new BadRequestException("bad input");
        }
        return "ok";
    }
}
