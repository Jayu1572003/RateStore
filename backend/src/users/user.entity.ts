import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Store } from '../stores/store.entity';
import { Rating } from '../ratings/rating.entity';

export enum UserRole {
  ADMIN = 'admin',
  NORMAL_USER = 'normal_user',
  STORE_OWNER = 'store_owner',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'text' })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NORMAL_USER,
  })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToMany(() => Store, (store) => store.owner)
  stores: Store[];

  @BeforeInsert()
  setCreated() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  @BeforeUpdate()
  setUpdated() {
    this.updated_at = new Date();
  }
}
