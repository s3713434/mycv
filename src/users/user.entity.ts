import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
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

  // If you are not using entity instance, these hooks will not show up.
  // for example you are saving data by objects directly, these will now show up.
  // Another example: insert(),update(),delete() will not use these hooks.
  // instead, save() and remove() would.
  @AfterInsert()
  logInsert() {
    console.log('insert a user with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('update a user with id,', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('remove a user with id', this.id);
  }
}
