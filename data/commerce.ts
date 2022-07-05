import {PaymentType} from "~/models/IgPageCommerceData";
import {MailingType} from "~/models/Order";

export const mailingMethods = [
    MailingType.SF_STATION,
    MailingType.SF_LOCKER,
    MailingType.OTHERS
]

export const mailingTypeToText = {
    [MailingType.SF_STATION]: "順豐站",
    [MailingType.SF_LOCKER]: "順便智能櫃",
    [MailingType.OTHERS]: "其他"
}

export const paymentMethods = [
    PaymentType.BANK_TRANSFER,
    PaymentType.FPS,
    PaymentType.PAYME,
    PaymentType.WECHAT_PAY_HK,
    PaymentType.ALIPAY_HK
]

export const paymentMethodsToText = {
    [PaymentType.BANK_TRANSFER]: "銀行轉賬",
    [PaymentType.FPS]: "FPS",
    [PaymentType.PAYME]: "PayMe",
    [PaymentType.WECHAT_PAY_HK]: "WeChat Pay HK",
    [PaymentType.ALIPAY_HK]: "AlipayHK"
}