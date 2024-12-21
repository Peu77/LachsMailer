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

    @CreateDateColumn()
    createdAt: Date;

    @Column({default: false})
    opened: boolean;

    @Column({nullable: true})
    openedAt: Date;

    @Column({default: false})
    clicked: boolean;

    @Column({nullable: true})
    clickedAt: Date;

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

    @CreateDateColumn()
    startAt: Date;

    @Column({nullable: true})
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

    @CreateDateColumn()
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

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    username: string;

    @Column()
    password: string;

    @JoinColumn()
    @ManyToOne(() => SessionEntity, session => session.submissions, {onDelete: 'CASCADE'})
    session: SessionEntity;
}