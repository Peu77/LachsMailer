import {Injectable} from '@nestjs/common';
import {EmailService} from "../email/email.service";
import {TrackerEntity, TrackerKeyDownEntity} from "./entity/Tracker.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {createTransport, Transporter} from "nodemailer";
import {ConfigService} from "@nestjs/config";


@Injectable()
export class TrackerService {

    transporter: Transporter

    constructor(
        private readonly emailService: EmailService,
        @InjectRepository(TrackerEntity)
        private readonly trackerRepository: Repository<TrackerEntity>,
        @InjectRepository(TrackerKeyDownEntity)
        private readonly trackerKeyDownRepository: Repository<TrackerKeyDownEntity>,
        private readonly configService: ConfigService
    ) {
        const config = {
            host: this.configService.getOrThrow("EMAIL_HOST"),
            port: Number(this.configService.getOrThrow<number>("EMAIL_PORT")),
            secure: false,
            auth: {
                user: this.configService.getOrThrow("EMAIL_AUTH_USER"),
                pass: this.configService.getOrThrow("EMAIL_AUTH_PASSWORD")
            }
        }

        this.transporter = createTransport(config);

        this.transporter.verify().then((e) => {
            console.log("Email service is ready to send emails");
            this.startScheduler()
        }).catch((e) => {
            console.error("Email service failed to connect", e);
        })
    }

    startScheduler() {
        const interval = setInterval(async () => {
            const targetsToSend = await this.emailService.getTargetsToSend()
            await Promise.all(targetsToSend.map(target => this.sendEmail(target.id)));
        }, 1000);


        interval.unref();
    }

    async sendEmail(targetId: number) {
        await this.emailService.resetTargetSendAt(targetId);
        const target = await this.emailService.getTargetById(targetId, {emailEntity: true, variables: true});

        console.log(`Sending email to ${target.email}`);

        const newTracker = await this.trackerRepository.save({
            target
        })
        console.log(`Tracker created with id ${newTracker.id}`);

        const trackerImg = `<img src="${this.configService.getOrThrow("API_URL")}/tracker/t/${newTracker.id}"/>`

        await this.transporter.sendMail({
            from: this.configService.getOrThrow("EMAIL_FROM"),
            to: target.email,
            subject: target.emailEntity.subject,
            text: "",
            html: target.emailEntity.body + trackerImg
        })
    }

    async triggerTracker(trackerId: number, ip: string, headers: any) {
        if (!await this.trackerRepository.existsBy({id: trackerId})) {
            console.log("someone tried to trigger a non existing tracker");
            console.log("ip", ip);
            console.log("headers", headers);
            throw new Error("Tracker not found");
        }
        console.log(`Tracker ${trackerId} triggered by ${ip}`);
        console.log("headers", headers);

        await this.trackerRepository.update(trackerId, {
            opened: true,
            openedAt: new Date(),
            ipAddress: ip,
            headers: JSON.stringify(headers)
        });
    }

    async pressKey(trackerId: number, key: string) {
        if (!await this.trackerRepository.existsBy({id: trackerId})) {
            throw new Error("Tracker not found");
        }
        console.log(`Tracker ${trackerId} pressed key ${key}`);

        await this.trackerKeyDownRepository.save({
            tracker: {id: trackerId},
            key
        })
    }

    async open(trackerId: number) {
        if (!await this.trackerRepository.existsBy({id: trackerId})) {
            throw new Error("Tracker not found");
        }
        console.log(`Tracker ${trackerId} opened`);

        await this.trackerRepository.update(trackerId, {
            clicked: true,
            clickedAt: new Date()
        });
    }
}
