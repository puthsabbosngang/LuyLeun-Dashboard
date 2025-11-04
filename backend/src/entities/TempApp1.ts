import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tempApp1' })
export class TempApp1 {
  @Column({ type: 'int', nullable: true })
    user_id!: number;

  @PrimaryColumn({ type: 'int' })
    id!: number;

  @Column({ type: 'int', nullable: true })
    lid!: number;

  @Column({ type: 'int', nullable: true })
    cycle!: number;

  @Column({ type: 'double', nullable: true })
    approved_loan_size!: number;
}
