import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {EmailModule} from './email/email.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { SchedulerModule } from './tracker/scheduler.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
           useFactory: (config: ConfigService) => {
                return  {
                    type: 'postgres',
                    host: config.get('DB_HOST'),
                    port: config.get('DB_PORT'),
                    username: config.get('DB_USERNAME'),
                    password: config.get('DB_PASSWORD'),
                    database: config.get('DB_DATABASE'),
                    entities: [
                        "dist/**/*.entity{.ts,.js}"
                    ],
                    synchronize: true,
                }
           }
        }), EmailModule, SchedulerModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
