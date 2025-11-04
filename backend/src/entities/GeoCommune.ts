import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GeoDistrict } from './GeoDistrict';

@Entity({ name: 'geo_commune' })
export class GeoCommune {
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
    total_village!: number;

  @Column({ nullable: true })
    type_en!: string;

  @Column({ nullable: true })
    type_kh!: string;

  @ManyToOne(() => GeoDistrict, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: true })
    @JoinColumn({ name: 'district_id' })
    district: GeoDistrict = new GeoDistrict;
    employees: any;
    employers: any;
    governmentOfficers: any;
    relatives: any;
  geoCommuneEmployees: any;
    geoCommuneGovernmentOfficers: any;
    geoCommuneRelatives: any;
    geoCommuneApplications: any;
    villages: any;
}
