import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'conf_company_bank' })
export class ConfCompanyBank {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    account_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    account_number!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    bank_name!: string;
}
