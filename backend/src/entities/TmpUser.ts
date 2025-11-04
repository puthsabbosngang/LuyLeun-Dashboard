import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tmp_user' })
export class TmpUser {
  @PrimaryColumn({ type: 'int' })
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    n_id!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    first_name_en!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    first_name_kh!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    last_name_en!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    last_name_kh!: string;
}
