import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'target_kpi' })
export class TargetKPI {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  criteria!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timeline!: string;

  @Column({ type: 'int', nullable: true })
  daily_target_account!: number;

  @Column({ type: 'int', nullable: true })
  daily_target_amount!: number;

  @Column({ type: 'int', nullable: true })
  monthly_target_account!: number;

  @Column({ type: 'int', nullable: true })
  monthly_target_amount!: number;
}
