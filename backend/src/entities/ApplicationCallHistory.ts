import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from './Application';

@Entity({ name: 'application_call_history' })
export class ApplicationCallHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  date!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  duration!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  number!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  type!: string;

  @Column({ type: 'int', nullable: true })
  application_id!: number;

  @ManyToOne(() => Application, (application) => application.callHistories, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'application_id' })
  application!: Application;
}
