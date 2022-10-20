import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';
import { User } from './User.entity';
import 'reflect-metadata';

class OrderItem {
  @Column('varchar', { nullable: false })
  name: string;

  @Column('numeric', { nullable: false })
  quantity: number;

  @Column('varchar', { nullable: false })
  image: string;

  @Column('numeric', { nullable: false })
  price: number;

  constructor(name: string, quantity: number, image: string, price: number) {
    this.name = name;
    this.quantity = quantity;
    this.image = image;
    this.price = price;
  }
}

class ShippingAddress {
  @Column('varchar', { nullable: false })
  fullName: string;

  @Column('text', { nullable: false })
  address: string;

  @Column('text', { nullable: false })
  city: string;

  @Column('text', { nullable: false })
  postalCode: string;

  @Column('text', { nullable: false })
  country: string;

  // constructor(
  //   fullName: string,
  //   address: string,
  //   city: string,
  //   postalCode: string,
  //   country: string
  // ) {
  //   this.fullName = fullName;
  //   this.address = address;
  //   this.city = city;
  //   this.postalCode = postalCode;
  //   this.country = country;
  // }
}

@Entity('Order')
export class Order {
  @ObjectIdColumn()
  _id?: ObjectID;

  @Column((type) => User)
  user: User;

  @Column((type) => OrderItem)
  orderItems: OrderItem[];

  @Column((type) => ShippingAddress)
  shippingAddress: ShippingAddress;

  @Column('varchar', { nullable: false })
  paymentMethod: string;

  @Column('numeric', { nullable: false })
  itemsPrice: number;

  @Column('numeric', { nullable: false })
  shippingPrice: number;

  @Column('numeric', { nullable: false })
  taxPrice: number;

  @Column('numeric', { nullable: false })
  totalPrice: number;

  @Column('boolean', { nullable: false, default: false })
  isPaid: boolean;

  @Column('boolean', { nullable: false, default: false })
  isDelivered: boolean;

  @Column('date')
  paidAt: Date;

  @Column('date')
  deliveredAt: Date;
}
