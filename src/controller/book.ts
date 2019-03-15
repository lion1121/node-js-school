import { BaseContext } from 'koa';
import { Equal, getManager, Not, Repository } from 'typeorm';
import { Book } from '../entity/book';
import { User } from '../entity/user';
import { validate, ValidationError } from 'class-validator';

export default class BookController {

    public static async getUserBooks(ctx: BaseContext) {
        // get a book repository to perform operations with book
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // get users id from route parameter
        const user: User = await userRepository.findOne(+ctx.params.id || 0);
        // get all users books
        const books = await bookRepository.find({where: {userId: user}});
        ctx.body = books;
    }

    public static async createBook(ctx: BaseContext) {
        // get a book repository to perform operations with book
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // get users id from route parameter
        const user: User = await userRepository.findOne(+ctx.params.id || 0);

        if (!user) {
            ctx.status = 400;
            ctx.body = `The user with id: ${+ctx.params.id} doesn't exist`;
            return;
        }

        const bookToBeSaved: Book = new Book();

        bookToBeSaved.name = ctx.request.body.name;
        bookToBeSaved.description = ctx.request.body.description;
        bookToBeSaved.userId = +ctx.params.id;
        bookToBeSaved.date = new Date();
        const book = await bookRepository.save(bookToBeSaved);

        // return CREATED status code and create book
        ctx.status = 201;
        ctx.body = book;
    }

    public static async updateBook(ctx: BaseContext) {
        // get a book repository to perform operations with book
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);

        const bookToBeUpdated: Book = new Book();
        bookToBeUpdated.id = +ctx.params.bookId;
        bookToBeUpdated.name = ctx.request.body.name;
        bookToBeUpdated.description = ctx.request.body.description;
        bookToBeUpdated.userId = +ctx.params.id;
        bookToBeUpdated.date = new Date();
        ctx.body = +ctx.params.bookId;

        // validate user entity
        const errors: ValidationError[] = await validate(bookToBeUpdated); // errors is an array of validation errors

        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        } else if (!await bookRepository.find({where: {userId: +ctx.params.id}})) {
            // check if a book with the specified id exists
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = 'The book you are trying to update does not exist in the db';
        } else if (!await userRepository.findOne(+ctx.params.id)) {
            // return BAD REQUEST status code and email already exists error
            ctx.status = 400;
            ctx.body = 'Book is not belonged any user';
        } else {
            // save the book contained in the PUT body
            const book = await bookRepository.save(bookToBeUpdated);
            // return CREATED status code and updated user
            ctx.status = 201;
            ctx.body = book;
        }
    }

    public static async deleteBook(ctx: BaseContext) {
        // get a book repository to perform operations with book
        const bookRepository = getManager().getRepository(Book);
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);

        // find the user by specified id
        const bookToRemove: Book = await bookRepository.findOne(+ctx.params.bookId || 0);
        if (!await userRepository.findOne(+ctx.params.id)) {
            // return BAD REQUEST status code and email already exists error
            ctx.status = 400;
            ctx.body = 'Book is not belonged any user';
        } else if (!bookToRemove) {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = 'The book you are trying to delete doesn\'t exist in the db';
        } else {
            // the user is there so can be removed
            await bookRepository.remove(bookToRemove);
            // return a NO CONTENT status code
            ctx.status = 204;
        }
    }
}