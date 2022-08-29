import {Discount} from "~/models/Discount";

export interface IgMediaCommerceData {
    _id: string; // Same as IgMedia code.
    pageId: string;
    active: boolean;
    customPrice: boolean;
    stock?: number;
    discount?: Discount;
}
