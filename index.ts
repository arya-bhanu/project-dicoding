import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { IBook } from './type/index.type';
import { BookService } from './service/book.service';

dotenv.config();

const app: Express = express();
const port = process.env.SERVER_PORT || 9000;

const bookService = new BookService([]);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
	res.send('Express + TypeScript Server');
});

app.post('/books', (req, res) => {
	const reqBody = req.body as IBook;
	const name = reqBody?.name;
	if (!name)
		return res.status(400).json({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});
	if (reqBody.readPage > reqBody.pageCount)
		return res.status(400).json({
			status: 'fail',
			message:
				'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});
	bookService.create(reqBody);
	res.status(201).json({
		status: 'success',
		message: 'Buku berhasil ditambahkan',
		data: {
			bookId: '1L7ZtDUFeGs7VlEt',
		},
	});
});

app.get('/books', (req, res) => {
	const books = bookService.getAll();
	res.status(200).json({
		status: 'success',
		data: {
			books:
				books.length === 0
					? books
					: books.map((el) => {
							return {
								id: el.id,
								name: el.name,
								publisher: el.publisher,
							};
					  }),
		},
	});
});

app.get('/books/:bookId', (req, res) => {
	const { bookId } = req.params;
	const book = bookService.findById(bookId);
	if (book)
		res.status(200).json({
			status: 'success',
			data: {
				book: book,
			},
		});
	res.status(404).json({
		status: 'fail',
		message: 'Buku tidak ditemukan',
	});
});

app.put('/books/:bookId', (req, res) => {
	const { bookId } = req.params;
	const reqBody = req.body as IBook;
	if (!reqBody?.name)
		res.status(400).json({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku',
		});
	if (reqBody.readPage > reqBody.pageCount)
		return res.status(400).json({
			status: 'fail',
			message:
				'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});
	if (bookService.update(bookId, reqBody)) {
		res.status(200).json({
			status: 'success',
			message: 'Buku berhasil diperbarui',
		});
	}
	res.status(404).json({
		status: 'fail',
		message: 'Gagal memperbarui buku. Id tidak ditemukan',
	});
});

app.delete('/books/:bookId', (req, res) => {
	const { bookId } = req.params;
	if (bookService.delete(bookId)) {
		res.status(200).json({
			status: 'success',
			message: 'Buku berhasil dihapus',
		});
	}
	res.status(404).json({
		status: 'fail',
		message: 'Buku gagal dihapus. Id tidak ditemukan',
	});
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
