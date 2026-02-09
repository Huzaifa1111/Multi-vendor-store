import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity('attributes')
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // e.g., 'Color', 'Size'

  @OneToMany(() => AttributeValue, (value) => value.attribute, { cascade: true })
  values: AttributeValue[];
}

@Entity('attribute_values')
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string; // e.g., 'Red', 'XL'

  @ManyToOne(() => Attribute, (attribute) => attribute.values, { onDelete: 'CASCADE' })
  attribute: Attribute;
}
