import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('positions')
export class PositionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  key: string;

  @Column({ name: 'label_en', type: 'varchar', length: 128 })
  labelEn: string;
}
