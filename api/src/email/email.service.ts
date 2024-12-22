import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {EmailEntity} from "./entity/Email.entity";
import {LessThan, MoreThanOrEqual, Repository} from "typeorm";
import {TargetEntity} from "./entity/Target.entity";

@Injectable()
export class EmailService {
    constructor(
        @InjectRepository(EmailEntity)
        private emailRepository: Repository<EmailEntity>,
        @InjectRepository(TargetEntity)
        private targetRepository: Repository<TargetEntity>,
    ) {
    }

    async createEmail(email: { subject: string; body: string }) {
        return this.emailRepository.save(email);
    }

    async addTarget(id: number, target: { email: string; variables: { key: string; value: string }[] }) {
        const email = await this.emailRepository.findOneBy({id});
        if (!email) {
            throw new Error("Email not found");
        }
        const targetEntity = {
            email: target.email,
            emailEntity: email,
            variables: target.variables
        };
        return this.targetRepository.save(targetEntity);
    }

    getEmails() {
        return this.emailRepository.find({
            relations: {
                targets: {
                    variables: true,
                    trackers: {
                        sessions: {
                            submissions: true
                        }
                    }
                },
            }
        });
    }

    async distributeScheduleDates(id: number, days: number) {
        const email = await this.emailRepository.findOneOrFail({
            where: {id}, relations: {
                targets: true
            }
        });

        const targets = email.targets;
        const now = new Date();
        const max = new Date();
        max.setDate(now.getDate() + days);
        const diff = max.getTime() - now.getTime();
        targets.forEach(target => {
            target.sendAt = new Date(now.getTime() + Math.random() * diff);
        });

        return await this.targetRepository.save(targets);
    }

    getTargetsToSend() {
        return this.targetRepository.find({
            where: {
                sendAt: LessThan(new Date())
            }
        });
    }

    resetTargetSendAt(targetId: number) {
        return this.targetRepository.update(targetId, {
            sendAt: null
        });
    }

    async setData(emailId: number, targets: { email: string; variables: { key: string; value: string }[] }[]) {
        const email = await this.emailRepository.findOneByOrFail({id: emailId});

        await this.targetRepository.delete({emailEntity: {id: emailId}});
        email.targets = targets as any;
        return this.emailRepository.save(email);
    }

    getTargetById(id: number, relations: {} = {}) {
        return this.targetRepository.findOne({where: {id}, relations});
    }

    deleteEmail(id: number) {
        return this.emailRepository.delete(id);
    }


    async cancelSchedule(emailId: number) {
        return this.targetRepository.update({emailEntity: {id: emailId}}, {
            sendAt: null
        })
    }
}
