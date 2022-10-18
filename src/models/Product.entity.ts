import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('Product')
export class Product {
  @ObjectIdColumn()
  _id?: ObjectID;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: false, unique: true })
  slug: string;

  @Column('varchar', { nullable: false })
  category: string;

  @Column('varchar', { nullable: false })
  image: string;

  @Column('numeric', { nullable: false })
  price: number;

  @Column('varchar', { nullable: false })
  brand: string;

  @Column('numeric', { nullable: false })
  rating: number;

  @Column('int', { nullable: false })
  numReviews: number;

  @Column('int', { nullable: false })
  countInStock: number;

  @Column('varchar', { nullable: false })
  description: string;
}
