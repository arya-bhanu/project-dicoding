import { Book } from '../model/book.model';
import { IBook } from '../type/index.type';
export class BookService {
	books: Book[];
	constructor(book: Book[]) {
		this.books = book;
	}
	create(newBook: IBook) {
		const newBookCreated = new Book(newBook);
		this.books.push(newBookCreated);
		return newBookCreated.id;
	}
	getAll() {
		return this.books;
	}
	findById(id: string): Book | undefined {
		return this.books.find((el) => el.id === id);
	}
	update(id: string, payload: IBook): boolean {
		let index = -1;
		this.books.forEach((el, index) => {
			if (el.id === id) {
				index = index;
			}
		});
		if (index !== -1) {
			this.books[index] = new Book(payload);
			return true;
		}
		return false;
	}

	delete(id: string): boolean {
		let index = -1;
		this.books.forEach((el, index) => {
			if (el.id === id) {
				index = index;
			}
		});
		if (index !== -1) {
			this.books.splice(index, 1);
			return true;
		}
		return false;
	}
}
