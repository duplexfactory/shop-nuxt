import {Discount, MailingDiscount} from "~/models/Discount";
import Dict = NodeJS.Dict;
import {ObjectId} from "mongodb";
import {PaymentMethodData} from "~/models/IgPageCommerceData";

export enum MailingType {
    SF_STATION,
    SF_LOCKER,
    OTHERS
}

export enum MailingInfoType {
    SF_STATION,
    SF_LOCKER,
    NAME,
    ADDRESS,
    PHONE,
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
        orderStatus: OrderStatus;
        medias: {
            code: string,
            price: number,
            discount?: Discount;
            quantity: number;
        }[]
        discount?: Discount;
        mailing: Mailing;
        mailingDiscount?: MailingDiscount;
        mailingInfo: {
            [key:number]: string // key MailingInfoType
        };
        paymentMethodData?: PaymentMethodData;
        paymentProofUrl?: string;
        note: string;
    }>
}

export interface Mailing {
    title: string;
    description?: string;
    type: MailingType; // SF_STATION, SF_LOCKER, OTHERS
    cost?: number;
    payOnArrive: boolean;
    info: MailingInfoType[];
}
