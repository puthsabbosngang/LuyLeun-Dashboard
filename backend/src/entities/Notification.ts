import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from './Application';
import { User } from './User';
import { Lead } from './Lead';
import { Customer } from './Customer'; // Assuming Customer entity exists

@Entity({ name: 'notification' })
export class Notification {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    content!: string;

  @Column({ type: 'bit', nullable: true })
    is_read!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
    title!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    type!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    topic!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    thumbnail!: string;

  @Column({ type: 'datetime', nullable: true })
    created_at!: Date;

  @Column({ type: 'datetime', nullable: true })
    updated_at!: Date;

  @Column({ type: 'datetime', nullable: true })
    scheduled_date!: Date;

  @Column({ type: 'bit', nullable: true })
    is_sent!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
    receiver!: string;

  @Column({ type: 'int', nullable: true })
    receiver_count!: number;

  // Relations
  @ManyToOne(() => Application, (application) => application.id, { nullable: true })
    @JoinColumn({ name: 'application_id' })
    application!: Application;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
    @JoinColumn({ name: 'staff_id' })
    staff!: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
    @JoinColumn({ name: 'customer_id' })
    customer!: User;

  @ManyToOne(() => Lead, (lead) => lead.id, { nullable: true })
  @JoinColumn({ name: 'lead_id' })
  lead!: Lead;
}
