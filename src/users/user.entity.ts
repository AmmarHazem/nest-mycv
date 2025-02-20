import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('AfterInser', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('AfterRemove', this.id);
  }

  @AfterUpdate()
  afterUpdate() {
    console.log('AfterUpdate', this.id);
  }
}
