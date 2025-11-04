import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { GeoCommune } from './GeoCommune';

@Entity({ name: 'application' })
export class Application {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ nullable: true })
    n_id!: string;

  @Column({ type: 'datetime', nullable: true })
    n_id_expiry_date!: Date;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: true })
    @JoinColumn({ name: 'user_id' })
    user!: User;

  @Column({ nullable: true })
    addr!: string;

  @Column({ nullable: true })
    cohabitation!: string;

  @Column({ nullable: true })
    living_duration!: string;

  @Column({ nullable: true })
    owner!: string;

  @Column({ type: 'date', nullable: true })
    dob!: Date;

  @Column({ nullable: true })
    edu_lvl!: string;

  @Column({ nullable: true })
    email!: string;

  @Column({ nullable: true })
    gender!: string;

  @Column({ nullable: true })
    marital_status!: string;

  @Column({ nullable: true })
    registered_phone!: string;

  @Column({ nullable: true })
    phone!: string;

  @Column({ nullable: true })
    status!: string;

  @Column({ nullable: true })
    first_name_en!: string;

  @Column({ nullable: true })
    first_name_kh!: string;

  @Column({ nullable: true })
    last_name_en!: string;

  @Column({ nullable: true })
    last_name_kh!: string;

  @Column({ nullable: true })
    phone_brand!: string;

  @Column({ nullable: true })
    phone_model!: string;

  @Column({ nullable: true })
    property!: string;

  @ManyToOne(() => GeoCommune, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'geo_commune_id' })
    geoCommune!: GeoCommune;

  @Column({ nullable: true })
    occupation_type!: string;

  @Column({ type: 'text', nullable: true })
    facebook_name!: string;

  @Column({ nullable: true })
    lat!: string;

  @Column({ nullable: true })
    lng!: string;

  @Column({ nullable: true })
    file_employment_agreement!: string;

  @Column({ nullable: true })
    file_national_id!: string;

  @Column({ nullable: true })
    file_payslip!: string;

  @Column({ nullable: true })
    file_photo!: string;

  @Column({ nullable: true })
    file_signature!: string;

  @ManyToOne(() => GeoCommune, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'birth_geo_commune_id' })
    birthGeoCommune!: GeoCommune;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'sales_id' })
    sales!: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'credit_id' })
    credit!: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'credit_committee_id' })
    creditCommittee!: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'accountant_id' })
    accountant!: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'collection_id' })
    collection!: User;

  @Column({ type: 'datetime', nullable: true })
    applied_date!: Date;

  @Column({ type: 'datetime', nullable: true })
    recommended_date!: Date;

  @Column({ type: 'datetime', nullable: true })
    rejected_date!: Date;

  @Column({ type: 'datetime', nullable: true })
    approved_date!: Date;

  @Column({ type: 'datetime', nullable: true })
    accepted_date!: Date;

  @Column({ type: 'datetime', nullable: true })
    cancelled_date!: Date;

  @Column({ type: 'datetime', nullable: true })
    created_at!: Date;

  @Column({ type: 'datetime', nullable: true })
    updated_at!: Date;

  @Column({ type: 'datetime', nullable: true })
    negotiated_date!: Date;

  @Column({ type: 'datetime', nullable: true })
    latest_contact_date!: Date;

  @Column({ type: 'datetime', nullable: true })
    ptp_date!: Date;

  @Column({ nullable: true })
    p2p_amount!: string;

  @Column({ nullable: true })
    action_result!: string;

  @Column({ nullable: true })
    next_action!: string;

  @Column({ nullable: true })
    last_paid_amount!: string;

  @Column({ type: 'datetime', nullable: true })
    closed_date!: Date;

  @Column({ type: 'double', nullable: true })
    ptp_amount!: number;

  @Column({ type: 'boolean', nullable: true })
    is_blacklisted!: boolean;

  @Column({ type: 'double', nullable: true })
    last_approved_loan_size!: number;
    amendingInfos: any;
  callHistories: any;
    contactLists: any;
    employees: any;
    employers: any;
    governmentOfficers: any;
  loanDetails: any;
    relatives: any;
    trackings: any;
    comments: any;
    communications: any;
}
