import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from './Application';

@Entity({ name: 'application_amending_info' })
export class ApplicationAmendingInfo {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ nullable: true })
    national_id!: string;

  @Column({ nullable: true })
    profile_photo!: string;

  @Column({ nullable: true })
    call_history!: string;

  @Column({ nullable: true })
    contact_list!: string;

  @ManyToOne(() => Application, (application) => application.amendingInfos, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        nullable: true,
    })
    @JoinColumn({ name: 'application_id' })
    application!: Application;
}
