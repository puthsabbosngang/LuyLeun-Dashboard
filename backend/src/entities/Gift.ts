import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'gift' })
export class Gift {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    description!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    image!: string;

  @Column({ type: 'boolean', nullable: true })
    is_showed!: boolean;

  @Column({ type: 'int', nullable: true })
    sort!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
    tag!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    title!: string;

  @Column({ type: 'smallint', nullable: true })
    type!: number;
}
