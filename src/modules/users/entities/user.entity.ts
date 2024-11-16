import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('users') // Specify the table name
export class User {
  @PrimaryGeneratedColumn('uuid') // Automatically generate a UUID for the primary key
  id: string;

  @Column({ unique: true }) // Ensure unique logins
  login: string;

  @Column() // Password storage
  password: string;

  @VersionColumn() // Automatically manage versioning
  version: number;

  @CreateDateColumn() // Automatically sets the creation timestamp
  createdAt: Date;

  @UpdateDateColumn() // Automatically updates the timestamp on changes
  updatedAt: Date;
}

export type SafeUser = Omit<User, 'password'>;
