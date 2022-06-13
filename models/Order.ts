import {Discount, MailingDiscount} from "~/models/Discount";

enum MailingType {
    SF_STATION,
    SF_LOCKER,
    OTHERS
}

export interface Order {
    _id: string;
    created: number;
    medias: {
        code: string,
        price: number,
        discount?: Discount;
    }[]
    discount?: Discount;
    mailing: Mailing;
    mailingDiscount?: MailingDiscount;
    note: string;
}

export interface Mailing {
    title: string;
    type: MailingType; // SF_STATION, SF_LOCKER, OTHERS
    cost: number;
}
