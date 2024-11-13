import { IBook } from '../type/index.type';
import { nanoid } from 'nanoid';
export class Book implements IBook {
	id?: string | undefined;
	name: string;
	year: number;
	author: string;
	summary: string;
	publisher: string;
	pageCount: number;
	readPage: number;
	finished?: boolean | undefined;
	reading: boolean;
	insertedAt?: string | undefined;
	updatedAt?: string | undefined;
	constructor({
		author,
		name,
		pageCount,
		publisher,
		readPage,
		reading,
		summary,
		year,
	}: IBook) {
		this.name = name;
		this.year = year;
		this.author = author;
		this.pageCount = pageCount;
		this.publisher = publisher;
		this.summary = summary;
		this.readPage = readPage;
		this.reading = reading;
		this.id = this.generateId();
		this.insertedAt = new Date().toISOString();
		this.finished = this.checkIsFinished();
	}

    private checkIsFinished(): boolean{
        return this.pageCount === this.readPage ? true : false
    }

	private generateId(): string {
		return nanoid();
	}
}
