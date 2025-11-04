import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'gallery' })
export class Gallery {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    file!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    type!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    link!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    status!: string;
}
