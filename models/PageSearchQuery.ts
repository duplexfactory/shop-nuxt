export class PageSearchQuery {
    keyword?: string;
    tag?: string;
    br?: boolean;
    phy?: boolean;
    constructor(keyword?: string, tag?: string, br?: boolean, phy?: boolean) {
        this.keyword = keyword;
        this.tag = tag;
        this.br = br;
        this.phy = phy;
    }
}