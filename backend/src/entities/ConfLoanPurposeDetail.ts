import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ConfLoanPurpose } from './ConfLoanPurpose';

@Entity({ name: 'conf_loan_purpose_detail' })
export class ConfLoanPurposeDetail {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    code!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    name!: string;

  @ManyToOne(() => ConfLoanPurpose, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'conf_loan_purpose_id' })
    loanPurpose!: ConfLoanPurpose;
}
