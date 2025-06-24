import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {TargetEntity} from "../../email/entity/Target.entity";

/**
 * If a email is sent to a target, a tracker is created to track the email and the history of the target.
 */
@Entity("tracker")
export class TrackerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => TargetEntity, target => target.trackers, {onDelete: 'CASCADE'})
    target: TargetEntity;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @Column({nullable: true, type: "timestamptz"})
    openedAt: Date;

    @Column({nullable: true})
    ipAddress: string;

    @Column({nullable: true})
    headers: string;

    @OneToMany(() => SessionEntity, session => session.tracker)
    sessions: SessionEntity[];
}

@Entity("session")
export class SessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "timestamptz"})
    startAt: Date;

    @Column({nullable: true, type: "timestamptz"})
    endAt: Date;

    @Column()
    ipAddress: string;

    @Column()
    userAgent: string;

    @Column()
    platform: string;

    @Column()
    language: string;

    @Column()
    cookiesEnabled: boolean;

    @Column()
    screenSize: string;

    @Column()
    windowSize: string;

    @OneToMany(() => TrackerKeyDownEntity, keyDown => keyDown.session)
    keyDowns: TrackerKeyDownEntity[];

    @OneToMany(() => SubmissionEntity, submission => submission.session)
    submissions: SubmissionEntity[];

    @OneToMany(() => MousePosEntity, mousePos => mousePos.session)
    mousePos: MousePosEntity[];

    @JoinColumn()
    @ManyToOne(() => TrackerEntity, tracker => tracker.sessions, {onDelete: 'CASCADE'})
    tracker: TrackerEntity;
}

@Entity("tracker_key_down")
export class TrackerKeyDownEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => SessionEntity, tracker => tracker.keyDowns, {onDelete: 'CASCADE'})
    session: SessionEntity;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @Column()
    selected: string

    @Column()
    key: string;
}

@Entity("submission")
export class SubmissionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({nullable: true})
    newPassword: string;

    @Column({nullable: true})
    newPasswordConfirm: string;


    @JoinColumn()
    @ManyToOne(() => SessionEntity, session => session.submissions, {onDelete: 'CASCADE'})
    session: SessionEntity;
}

@Entity("mouse_pos")
export class MousePosEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => SessionEntity, session => session.submissions, {onDelete: 'CASCADE'})
    session: SessionEntity;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @Column()
    x: number;

    @Column()
    y: number;
}