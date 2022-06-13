import {Discount} from "~/models/Discount";
import {Mailing} from "~/models/Order";

export interface IgPageCommerceData {
    _id: string; // Same as IgPage _id.
    discount?: Discount;
    mailing: Mailing[];
}
