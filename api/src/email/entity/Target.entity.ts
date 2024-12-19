import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {EmailEntity} from "./Email.entity";

@Entity("email_target")
export class TargetEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @JoinColumn()
    @ManyToOne(() => EmailEntity, email => email.targets)
    emailEntity: EmailEntity;

    @OneToMany(() => TargetVariableEntity, targetVariable => targetVariable.target, {cascade: true})
    variables: TargetVariableEntity[];
}

@Entity("email_target_variable")
export class TargetVariableEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => TargetEntity, target => target.variables, {onDelete: "CASCADE"})
    target: TargetEntity;

    @Column()
    key: string;

    @Column()
    value: string;
}