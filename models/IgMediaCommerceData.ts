import {Discount} from "~/models/Discount";

export interface IgMediaCommerceData {
    _id: string; // Same as IgMedia code.
    active: boolean;
    customPrice: boolean;
    stock?: number;
    discount?: Discount;
}
