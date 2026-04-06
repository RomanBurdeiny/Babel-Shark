import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('translations')
export class TranslationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'term_key', type: 'varchar', length: 64, unique: true })
  termKey: string;

  @Column({ name: 'text_ru', type: 'varchar', length: 255 })
  textRu: string;
}
