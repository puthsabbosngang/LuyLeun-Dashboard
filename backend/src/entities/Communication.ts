import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Application } from './Application';
import { User } from './User';
import { Lead } from './Lead';

@Entity({ name: 'communication' })
export class Communication {
  @PrimaryGeneratedColumn()
    id!: number;

  @CreateDateColumn({ type: 'datetime', precision: 6, nullable: true })
    created_at!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
    note!: string;

  @UpdateDateColumn({ type: 'datetime', precision: 6, nullable: true })
    updated_at!: Date;

  @Column({ type: 'int', nullable: true })
    application_id!: number;

  @Column({ type: 'int', nullable: true })
    staff_id!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
    purpose!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
    type!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
    recipient!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
    status!: string;

  @Column({ type: 'datetime', precision: 6, nullable: true })
    ptp_date!: Date;

  @Column({ type: 'double', nullable: true })
    ptp_amount!: number;

  @Column({ type: 'int', nullable: true })
    lead_id!: number;

  @ManyToOne(() => Application, (application) => application.communications, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn({ name: 'application_id' })
    application!: Application;

  @ManyToOne(() => User, (user) => user.communications, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn({ name: 'staff_id' })
    staff!: User;

  @ManyToOne(() => Lead, (lead) => lead.communications, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead | undefined;
}
