export class PaginationQuery {
    skip: number;
    limit: number;

    constructor(skip: number = 0, limit: number = 10) {
        this.skip = skip;
        this.limit = limit;
    }
}