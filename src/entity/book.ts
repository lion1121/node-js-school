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
    @Length(5, 80)
    name: string;

    @Column({
        length: 80
    })
    @Length(5, 80)
    description: string;

    @Column()
    userId: number;

    @Column()
    date: Date;

    @ManyToOne(type => User, user => user.book)
    user: User;
}
