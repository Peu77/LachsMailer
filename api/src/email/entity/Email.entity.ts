import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {TargetEntity} from "./Target.entity";

@Entity("email")
export class EmailEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subject: string;

    @Column()
    body: string;

    @OneToMany(() => TargetEntity, target => target.emailEntity, {cascade: true})
    targets: TargetEntity[];

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamptz"})
    updatedAt: Date;
}