import {Discount} from "~/models/Discount";
import {Mailing} from "~/models/Order";

export interface IgPageCommerceData {
    _id: string; // Same as IgPage _id.
    discount?: Discount;
    mailing: Mailing[];
    paymentMethodData: PaymentMethodData[];
}

export enum PaymentType {
    BANK_TRANSFER,
    FPS,
    PAYME,
    WECHAT_PAY_HK,
    ALIPAY_HK
}

export interface PaymentMethodData {
    method: PaymentType;
}

export interface BankTransferPaymentMethodData extends PaymentMethodData {
    method: PaymentType.BANK_TRANSFER;
    bank: string;
    accountNumber: number;
    accountName: string;
}

export interface FPSPaymentMethodData extends PaymentMethodData {
    method: PaymentType.FPS;
    phone: string;
    account: string; // 預設帳戶，如需選擇帳戶，請選擇 HSBC 匯豐銀行
    accountName: string;
}

export interface QRCodePaymentMethodData extends PaymentMethodData {
    method: PaymentType.PAYME | PaymentType.WECHAT_PAY_HK | PaymentType.ALIPAY_HK;
    qrCodeUrl: string;
}

