import { BaseContext } from 'koa';
import { getManager, Repository } from 'typeorm';
import { Book } from '../entity/book';
import { User } from '../entity/user';

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
}