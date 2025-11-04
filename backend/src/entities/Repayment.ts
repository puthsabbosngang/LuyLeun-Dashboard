import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Application } from './Application';

@Entity({ name: 'repayment' })
export class Repayment {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'int', nullable: true })
    application_id!: number;

  @Column({ type: 'int', nullable: true })
    cycle!: number;

  @Column({ type: 'date', nullable: true })
    due_date!: Date;

  @Column({ type: 'int', nullable: true })
    duration!: number;

  @Column({ type: 'double', nullable: true })
    principal_amount!: number;

  @Column({ type: 'double', nullable: true })
    interest_amount!: number;

  @Column({ type: 'double', nullable: true })
    penalty_fee!: number;

  @Column({ type: 'date', nullable: true })
    penalty_date!: Date;

  @Column({ type: 'double', nullable: true })
    repayment_amount!: number;

  @Column({ type: 'double', nullable: true })
    remaining_principal!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    status!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    type!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    note!: string;

  @Column({ type: 'date', nullable: true })
    last_contact_date!: Date;

  @Column({ type: 'date', nullable: true })
    ptp_date!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
    deposit_bank!: string;

  @Column({ type: 'datetime', nullable: true })
    deposit_date!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
    receipt!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    deposit_account_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    deposit_account_number!: string;

  @Column({ type: 'datetime', nullable: true })
    trxn_date!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
    trxn_type!: string;

  @Column({ type: 'double', nullable: true })
    paid_interest_amount!: number;

  @Column({ type: 'double', nullable: true })
    paid_penalty_fee!: number;

  @Column({ type: 'double', nullable: true })
    paid_amount!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    file_receipt!: string;

  @Column({ type: 'double', nullable: true })
    waived_interest!: number;

  @Column({ type: 'double', nullable: true })
    waived_penalty!: number;

  @Column({ type: 'double', nullable: true })
    waived_principal!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    next_action!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    taken_action!: string;

  @Column({ type: 'double', nullable: true })
    total_waived!: number;

  @Column({ type: 'int', nullable: true })
    collection_id!: number;

  @Column({ type: 'datetime', nullable: true })
    created_at!: Date;

  @Column({ type: 'datetime', nullable: true })
    updated_at!: Date;

  @Column({ type: 'int', nullable: true })
    accountant_id!: number;

  @Column({ type: 'tinyint', default: 0 })
    is_migrated!: boolean;

  // Relations
  @ManyToOne(() => Application)
    @JoinColumn({ name: 'application_id' })
    application!: Application;

  @ManyToOne(() => User)
    @JoinColumn({ name: 'collection_id' })
    collection!: User;

  @ManyToOne(() => User)
    @JoinColumn({ name: 'accountant_id' })
    accountant!: User;
}
