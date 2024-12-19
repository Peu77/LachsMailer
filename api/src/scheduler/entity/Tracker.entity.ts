import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {TargetEntity} from "../../email/entity/Target.entity";

/**
 * If a email is sent to a target, a tracker is created to track the email and the history of the target.
 */
@Entity()
export class TrackerEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => TargetEntity, target => target.trackers, {onDelete: 'CASCADE'})
    target: TargetEntity;

    @Column()
    createdAt: Date;

    @Column({default: false})
    opened: boolean;

    @Column({nullable: true})
    openedAt: Date;

    @Column({default: false})
    clicked: boolean;

    @Column({nullable: true})
    clickedAt: Date;
}