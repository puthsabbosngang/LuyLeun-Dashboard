import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tempRst' })
export class TempRst {
  @Column({ type: 'int', nullable: true })
    range_num!: number;

  @Column({ type: 'int', nullable: true })
    user_id!: number;

  @PrimaryColumn({ type: 'int' })
    id!: number;

  @Column({ type: 'int', nullable: true })
    previous_id!: number;

  @Column({ type: 'int', nullable: true })
    cycle!: number;

  @Column({ type: 'int', nullable: true })
    previous_cycle!: number;

  @Column({ type: 'double', nullable: true })
    approved_loan_size!: number;

  @Column({ type: 'double', nullable: true })
    last_approved_loan_size!: number;
}
