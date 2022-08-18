import {PaymentType} from "~/models/IgPageCommerceData";
import {MailingInfoType, MailingType, OrderStatus} from "~/models/Order";

export const mailingMethods = [
    MailingType.SF_STATION,
    MailingType.SF_LOCKER,
    MailingType.OTHERS
]

export const mailingInfoTypes = [
    MailingInfoType.SF_STATION,
    MailingInfoType.SF_LOCKER,
    MailingInfoType.NAME,
    MailingInfoType.PHONE,
    MailingInfoType.ADDRESS,
    MailingInfoType.OTHERS
]

export const mailingTypeToText = {
    [MailingType.SF_STATION]: "順豐站",
    [MailingType.SF_LOCKER]: "順便智能櫃",
    [MailingType.OTHERS]: "其他"
}

export const mailingInfoTypeToText = {
    [MailingInfoType.SF_STATION]: "順豐站",
    [MailingInfoType.SF_LOCKER]: "順便智能櫃",
    [MailingInfoType.NAME]: "名稱",
    [MailingInfoType.ADDRESS]: "地址",
    [MailingInfoType.PHONE]: "電話",
    [MailingInfoType.OTHERS]: "其他"
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

export const orderStatusTipText = {
    [OrderStatus.VERIFICATION_FAILED]: "此店鋪未能核實你上次提交的付款證明，請重新提交。如不清楚爲何未能核實，請聯絡店鋪。",
    [OrderStatus.PENDING]: "請付款並上傳證明。",
    [OrderStatus.TB_VERIFIED]: "你已經提交了付款證明，請等候店鋪核實。",
    [OrderStatus.VERIFIED]: "店鋪已成功核實了你的付款證明，請等候店鋪發貨。",
    [OrderStatus.MAILED]: "店鋪已發貨，請準備收貨。"
}

export const orderStatusColorClass = {
    [OrderStatus.VERIFICATION_FAILED]: "text-red-500",
    [OrderStatus.PENDING]: "text-yellow-500",
    [OrderStatus.TB_VERIFIED]: "text-blue-500",
    [OrderStatus.VERIFIED]: "text-green-500",
    [OrderStatus.MAILED]: "text-green-500"
}