import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { GeoDistrict } from './GeoDistrict';

@Entity({ name: 'geo_province' })
export class GeoProvince {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ nullable: true })
    code!: string;

  @Column({ nullable: true })
    name_en!: string;

  @Column({ nullable: true })
    name_kh!: string;

  @Column({ nullable: true })
    prefix!: string;

  @Column({ type: 'int', nullable: true })
    total_commune!: number;

  @Column({ type: 'int', nullable: true })
    total_district!: number;

  @Column({ type: 'int', nullable: true })
    total_village!: number;

  @Column({ nullable: true })
    type_en!: string;

  @Column({ nullable: true })
    type_kh!: string;

  @Column({ type: 'int', nullable: true })
    sort!: number;

  @OneToMany(() => GeoDistrict, (district) => district.province)
    districts!: GeoDistrict[];
}
