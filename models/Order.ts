import {Discount, MailingDiscount} from "~/models/Discount";
import Dict = NodeJS.Dict;
import {ObjectId} from "mongodb";
import {PaymentMethodData} from "~/models/IgPageCommerceData";

export enum MailingType {
    SF_STATION,
    SF_LOCKER,
    OTHERS
}

export enum OrderStatus {
    VERIFICATION_FAILED,
    PENDING,
    TB_VERIFIED,
    VERIFIED,
    MAILED
}

export interface Order {
    _id?: ObjectId;
    created: number;
    shops: Dict<{
        medias: {
            code: string,
            price: number,
            discount?: Discount;
            quantity: number;
        }[]
        discount?: Discount;
        mailing: Mailing;
        mailingDiscount?: MailingDiscount;
        note: string;
        orderStatus: OrderStatus;
        paymentMethodData?: PaymentMethodData;
        paymentProofUrl?: string;
    }>
}

export interface Mailing {
    title: string;
    type: MailingType; // SF_STATION, SF_LOCKER, OTHERS
    cost?: number;
    payOnArrive: boolean;
}
