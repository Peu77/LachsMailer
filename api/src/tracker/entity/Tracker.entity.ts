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

    @OneToMany(() => TrackerKeyDownEntity, keyDown => keyDown.tracker)
    keyDowns: TrackerKeyDownEntity[];
}

@Entity("tracker_key_down")
export class TrackerKeyDownEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => TrackerEntity, tracker => tracker.keyDowns, {onDelete: 'CASCADE'})
    tracker: TrackerEntity;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    key: string;
}