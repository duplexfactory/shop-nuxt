import {PaymentType} from "~/models/IgPageCommerceData";
import {MailingType, OrderStatus} from "~/models/Order";

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
    PaymentType.ALIPAY_HK,
    PaymentType.IN_PERSON
]

export const paymentMethodsToText = {
    [PaymentType.BANK_TRANSFER]: "銀行轉賬",
    [PaymentType.FPS]: "FPS",
    [PaymentType.PAYME]: "PayMe",
    [PaymentType.WECHAT_PAY_HK]: "WeChat Pay HK",
    [PaymentType.ALIPAY_HK]: "AlipayHK",
    [PaymentType.IN_PERSON]: "親身付款"
}

export const orderStatusToText = {
    [OrderStatus.VERIFICATION_FAILED]: "核實失敗",
    [OrderStatus.PENDING]: "待付款",
    [OrderStatus.TB_VERIFIED]: "待核實",
    [OrderStatus.VERIFIED]: "已付款",
    [OrderStatus.MAILED]: "已發貨"
}

export const orderStatusColorClass = {
    [OrderStatus.VERIFICATION_FAILED]: "text-red-500",
    [OrderStatus.PENDING]: "text-yellow-500",
    [OrderStatus.TB_VERIFIED]: "text-blue-500",
    [OrderStatus.VERIFIED]: "text-green-500",
    [OrderStatus.MAILED]: "text-green-500"
}