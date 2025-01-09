import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private configService: ConfigService) {
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers.authorization

        if(apiKey !== this.configService.getOrThrow("API_KEY")) {
            throw new UnauthorizedException("Unauthorized")
        }

        return true
    }
}