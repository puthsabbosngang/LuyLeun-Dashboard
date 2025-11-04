import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Lead } from './Lead';

@Entity({ name: 'lead_tracking' })
export class LeadTracking {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'datetime', nullable: true })
    created_at!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
    remark!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    status!: string;

  @Column({ type: 'datetime', nullable: true })
    updated_at!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
    reason!: string;

  // Relations
  @ManyToOne(() => Lead, (lead) => lead.id, { nullable: true })
    @JoinColumn({ name: 'lead_id' })
    lead!: Lead;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
    @JoinColumn({ name: 'sales_id' })
    sales!: User;
}
