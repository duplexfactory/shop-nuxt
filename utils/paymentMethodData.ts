import {
    BankTransferPaymentMethodData, FPSPaymentMethodData, InPersonPaymentMethodData,
    PaymentMethodData, PaymentType, QRCodePaymentMethodData,
} from "~/models/IgPageCommerceData";

export function structurePaymentMethodData(paymentMethodData: PaymentMethodData) {
    if (paymentMethodData.method === PaymentType.BANK_TRANSFER) {
        const d = paymentMethodData as BankTransferPaymentMethodData
        return [
            {title: "銀行名稱", value: d.bank},
            {title: "戶口號碼", value: d.accountNumber},
            {title: "戶口名稱", value: d.accountName}
        ]
    }
    if (paymentMethodData.method === PaymentType.FPS) {
        const d = paymentMethodData as FPSPaymentMethodData
        return [
            {title: "電話號碼", value: d.phone},
            {title: "收款賬戶", value: d.account},
            {title: "戶口名稱", value: d.accountName}
        ]
    }
    if (paymentMethodData.method === PaymentType.IN_PERSON) {
        const d = paymentMethodData as InPersonPaymentMethodData
        return [
            {title: "描述", value: d.description},
        ]
    }
    if ([PaymentType.PAYME, PaymentType.WECHAT_PAY_HK, PaymentType.ALIPAY_HK].includes(paymentMethodData.method)) {
        const d = paymentMethodData as QRCodePaymentMethodData
        return [
            {title: "QR Code", imageUrl: d.qrCodeUrl},
        ]
    }
    return []
}
