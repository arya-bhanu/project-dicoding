import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import { IBook } from './type/index.type';
import { BookService } from './service/book.service';
import Joi from 'joi';

dotenv.config();

const init = async () => {
	const server = Hapi.server({
		port: process.env.SERVER_PORT || 9000,
		host: 'localhost',
	});

	const bookService = new BookService([]);

	server.validator(Joi);

	// Home route
	server.route({
		method: 'GET',
		path: '/',
		handler: (request, h) => {
			return 'Hapi + TypeScript Server';
		},
	});

	// Create book route
	server.route({
		method: 'POST',
		path: '/books',
		handler: (request, h) => {
			const reqBody = request.payload as IBook;
			const name = reqBody?.name;

			if (!name) {
				return h
					.response({
						status: 'fail',
						message: 'Gagal menambahkan buku. Mohon isi nama buku',
					})
					.code(400);
			}

			if (reqBody.readPage > reqBody.pageCount) {
				return h
					.response({
						status: 'fail',
						message:
							'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
					})
					.code(400);
			}

			bookService.create(reqBody);

			console.log(bookService.books);
			return h
				.response({
					status: 'success',
					message: 'Buku berhasil ditambahkan',
					data: {
						bookId: '1L7ZtDUFeGs7VlEt',
					},
				})
				.code(201);
		},
	});

	// Get all books route
	server.route({
		method: 'GET',
		path: '/books',
		handler: (request, h) => {
			const books = bookService.getAll();
			return h
				.response({
					status: 'success',
					data: {
						books:
							books.length === 0
								? books
								: books.map((el) => ({
										id: el.id,
										name: el.name,
										publisher: el.publisher,
								  })),
					},
				})
				.code(200);
		},
	});

	// Get book by ID route
	server.route({
		method: 'GET',
		path: '/books/{bookId}',
		handler: (request, h) => {
			const { bookId } = request.params;
			const book = bookService.findById(bookId);

			if (book) {
				return h
					.response({
						status: 'success',
						data: {
							book: book,
						},
					})
					.code(200);
			}

			return h
				.response({
					status: 'fail',
					message: 'Buku tidak ditemukan',
				})
				.code(404);
		},
	});

	// Update book route
	server.route({
		method: 'PUT',
		path: '/books/{bookId}',
		handler: (request, h) => {
			const { bookId } = request.params;
			const reqBody = request.payload as IBook;

			if (!reqBody?.name) {
				return h
					.response({
						status: 'fail',
						message: 'Gagal memperbarui buku. Mohon isi nama buku',
					})
					.code(400);
			}

			if (reqBody.readPage > reqBody.pageCount) {
				return h
					.response({
						status: 'fail',
						message:
							'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
					})
					.code(400);
			}

			if (bookService.update(bookId, reqBody)) {
				return h
					.response({
						status: 'success',
						message: 'Buku berhasil diperbarui',
					})
					.code(200);
			}

			return h
				.response({
					status: 'fail',
					message: 'Gagal memperbarui buku. Id tidak ditemukan',
				})
				.code(404);
		},
	});

	// Delete book route
	server.route({
		method: 'DELETE',
		path: '/books/{bookId}',
		handler: (request, h) => {
			const { bookId } = request.params;

			if (bookService.delete(bookId)) {
				return h
					.response({
						status: 'success',
						message: 'Buku berhasil dihapus',
					})
					.code(200);
			}

			return h
				.response({
					status: 'fail',
					message: 'Buku gagal dihapus. Id tidak ditemukan',
				})
				.code(404);
		},
	});

	await server.start();
	console.log(
		`⚡️[server]: Server is running at http://localhost:${server.settings.port}`
	);
};

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
});

init();
