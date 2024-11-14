"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = __importDefault(require("@hapi/hapi"));
const dotenv_1 = __importDefault(require("dotenv"));
const book_service_1 = require("./service/book.service");
const joi_1 = __importDefault(require("joi"));
dotenv_1.default.config();
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = hapi_1.default.server({
        port: process.env.SERVER_PORT || 9000,
        host: 'localhost',
    });
    const bookService = new book_service_1.BookService([]);
    server.validator(joi_1.default);
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
            const reqBody = request.payload;
            const name = reqBody === null || reqBody === void 0 ? void 0 : reqBody.name;
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
                    message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
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
                    books: books.length === 0
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
            const reqBody = request.payload;
            if (!(reqBody === null || reqBody === void 0 ? void 0 : reqBody.name)) {
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
                    message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
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
    yield server.start();
    console.log(`⚡️[server]: Server is running at http://localhost:${server.settings.port}`);
});
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
init();
