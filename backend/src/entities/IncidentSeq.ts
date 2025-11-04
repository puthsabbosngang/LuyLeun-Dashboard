import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'incident_seq' })
export class IncidentSeq {
  @PrimaryColumn({ type: 'bigint' })
    next_val!: string; // Use string to safely handle bigints in TypeScript/JS
}
