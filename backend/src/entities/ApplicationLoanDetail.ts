import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from './Application';

@Entity({ name: 'application_loan_detail' })
export class ApplicationLoanDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  account_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  account_number!: string;

  @Column({ type: 'double', nullable: true })
  approved_interest!: number;

  @Column({ type: 'int', nullable: true })
  approved_loan_size!: number;

  @Column({ type: 'int', nullable: true })
  approved_loan_term!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  approved_note!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bank!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  loan_purpose!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  loan_purpose_detail!: string;

  @Column({ type: 'double', nullable: true })
  recommended_interest!: number;

  @Column({ type: 'int', nullable: true })
  recommended_loan_size!: number;

  @Column({ type: 'int', nullable: true })
  recommended_loan_term!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  recommended_note!: string;

  @Column({ type: 'int', nullable: true })
  requested_loan_size!: number;

  @Column({ type: 'int', nullable: true })
  requested_loan_term!: number;

  @Column({ type: 'double', nullable: true })
  service_fee!: number;

  @Column({ type: 'int', nullable: true })
  application_id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deposit_receipt!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deposit_date!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deposit_note!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deposit_bank!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  trxn_number!: string;

  @Column({ type: 'date', nullable: true })
  approved_date!: Date;

  @Column({ type: 'date', nullable: true })
  last_contact_date!: Date;

  @Column({ type: 'date', nullable: true })
  ptp_date!: Date;

  @Column({ type: 'int', nullable: true })
  last_loan_amount!: number;

  @Column({ type: 'int', nullable: true })
  cycle!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_deposit_receipt!: string;

  @Column({ type: 'int', nullable: true })
  negotiated_loan_size!: number;

  @Column({ type: 'int', nullable: true })
  negotiated_loan_term!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cancelled_reason!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cancelled_reason_detail!: string;

  @Column({ type: 'double', nullable: true })
  interest_amount!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deposit_reason!: string;

  @Column({ type: 'text', nullable: true })
  recommended_reason!: string;

  @Column({ type: 'text', nullable: true })
  rejected_reason!: string;

  @ManyToOne(() => Application, (application) => application.loanDetails, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'application_id' })
  application!: Application;
}
