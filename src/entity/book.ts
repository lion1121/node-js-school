import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Length } from 'class-validator';
import { User } from './user';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 80
    })
    @Length(10, 80)
    name: string;

    @Column({
        length: 255
    })
    description: string;

    @Column()
    userId: number;

    @ManyToOne(type => User, user => user.book)
    user: User;
}
