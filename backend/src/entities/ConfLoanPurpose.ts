import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'conf_loan_purpose' })
export class ConfLoanPurpose {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    code!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    name!: string;
}
