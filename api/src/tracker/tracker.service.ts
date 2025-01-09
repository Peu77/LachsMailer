import {Injectable} from '@nestjs/common';
import {EmailService} from "../email/email.service";
import {
    MousePosEntity,
    SessionEntity,
    SubmissionEntity,
    TrackerEntity,
    TrackerKeyDownEntity
} from "./entity/Tracker.entity";
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
        @InjectRepository(SessionEntity)
        private readonly sessionRepository: Repository<SessionEntity>,
        @InjectRepository(SubmissionEntity)
        private readonly submissionRepository: Repository<SubmissionEntity>,
        @InjectRepository(MousePosEntity)
        private readonly mousePosRepository: Repository<MousePosEntity>,
        private readonly configService: ConfigService
    ) {
        const config = {
            host: this.configService.getOrThrow("EMAIL_HOST"),
            port: Number(this.configService.getOrThrow<number>("EMAIL_PORT")),
            secure: true,
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
            console.error(config)
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
        let htmlContext = target.emailEntity.body + trackerImg;

        if (target.variables.length > 0) {
            target.variables.forEach(variable => {
                htmlContext = htmlContext.replaceAll(`{${variable.key}}`, variable.value);
            });
        }

        htmlContext = htmlContext.replaceAll(`{trackerId}`, newTracker.id.toString());

        console.log("htmlContext", htmlContext);

        await this.transporter.sendMail({
            from: (target.emailEntity.from + ` <${this.configService.getOrThrow("EMAIL_AUTH_USER")}>`) || this.configService.getOrThrow("EMAIL_FROM"),
            to: target.email,
            subject: target.emailEntity.subject,
            text: "",
            html: htmlContext
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
            openedAt: new Date(),
            ipAddress: ip,
            headers: JSON.stringify(headers)
        });
    }

    async pressKey(sessionId: number, key: string, selected: string) {
        if (!await this.sessionRepository.existsBy({id: sessionId})) {
            throw new Error("Session not found");
        }

        await this.trackerKeyDownRepository.save({
            session: {id: sessionId},
            key,
            selected
        })
    }

    async startSession(trackerId: number, userData: {
        ipAddress: string,
        userAgent: string,
        platform: string,
        language: string
        cookiesEnabled: boolean,
        screenSize: string,
        windowSize: string
    }): Promise<number> {
        if (!await this.trackerRepository.existsBy({id: trackerId})) {
            throw new Error("Tracker not found: " + trackerId);
        }

        const session = await this.sessionRepository.save({
            tracker: {id: trackerId},
            ...userData
        })

        console.log(`Session ${session.id} started at ${new Date().toLocaleDateString()}`);

        return session.id;
    }

    async endSession(sessionId: number) {
        if (!await this.sessionRepository.existsBy({id: sessionId})) {
            throw new Error("Session not found");

        }

        await this.sessionRepository.update(sessionId, {
            endAt: new Date()
        })

        console.log(`Session ${sessionId} ended at ${new Date().toLocaleDateString()}`);
    }

    async submit(sessionId: number, username: string, password: string) {
        if (!await this.sessionRepository.existsBy({id: sessionId})) {
            throw new Error("Session not found");
        }

        console.log(`Session ${sessionId} submitted at ${new Date().toLocaleDateString()}`);
        await this.submissionRepository.save({
            session: {id: sessionId},
            username,
            password
        })
    }

    async mousePos(sessionId: number, x: number, y: number) {
        if (!await this.sessionRepository.existsBy({id: sessionId})) {
            throw new Error("Session not found");
        }

        await this.mousePosRepository.save({
            session: {id: sessionId},
            x,
            y
        })
    }
}
