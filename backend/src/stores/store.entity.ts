import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Rating } from '../ratings/rating.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'uuid', nullable: true })
  owner_id: string | null;

  @ManyToOne(() => User, (user) => user.stores, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User | null;

  @OneToMany(() => Rating, (rating) => rating.store)
  ratings: Rating[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  get avgRating(): number | null {
    if (!this.ratings || this.ratings.length === 0) {
      return null;
    }
    const sum = this.ratings.reduce((acc, r) => acc + r.value, 0);
    return Math.round((sum / this.ratings.length) * 100) / 100;
  }

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
