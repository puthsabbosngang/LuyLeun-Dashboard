import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { GeoCommune } from './GeoCommune';
import { ApplicationGovernmentOfficer } from './ApplicationGovernmentOfficer';

@Entity({ name: 'geo_commune_application_government_officers' })
@Unique('UK_mxcvp47j56vknd6d5w9q965bo', ['application_government_officers_id'])
export class GeoCommuneApplicationGovernmentOfficers {
  @PrimaryColumn()
    geo_commune_id!: number;

  @PrimaryColumn()
    application_government_officers_id!: number;

  @ManyToOne(() => GeoCommune, (geoCommune) => geoCommune.geoCommuneGovernmentOfficers, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'geo_commune_id' })
    geoCommune!: GeoCommune;

  @ManyToOne(() => ApplicationGovernmentOfficer, (officer) => officer.geo_commune, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'application_government_officers_id' })
    applicationGovernmentOfficer!: ApplicationGovernmentOfficer;
}
