import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('User')
export class User {
  @ObjectIdColumn()
  _id?: ObjectID;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: false, unique: true })
  email: string;

  @Column('varchar', { nullable: false })
  password: string;

  @Column('boolean', { nullable: false, default: false })
  isAdmin: boolean;
}
