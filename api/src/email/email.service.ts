import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {EmailEntity} from "./entity/Email.entity";
import {Repository} from "typeorm";
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

    async addTarget(id: number, target: { email: string; sendAt: Date, variables: { key: string; value: string }[] }) {
        const email = await this.emailRepository.findOneBy({id});
        if (!email) {
            throw new Error("Email not found");
        }
        const targetEntity = {
            email: target.email,
            emailEntity: email,
            sendAt: target.sendAt,
            variables: target.variables
        };
        return this.targetRepository.save(targetEntity);
    }

    getEmails() {
        return this.emailRepository.find({
            relations: {
                targets: {
                    variables: true
                }
            }
        });
    }

    deleteEmail(id: number) {
        return this.emailRepository.delete(id);
    }
}
