import {Discount, DiscountType, ThresholdType} from "~/models/Discount";

export function discountToText(discount: Discount) {
    let text = ""
    if (discount.thresholdType === ThresholdType.COUNT) {
        text += `滿 ${discount.threshold} 件`
    }
    else if (discount.thresholdType === ThresholdType.VALUE) {
        text += `滿 HK$ ${discount.threshold}`
    }

    if (discount.discountType === DiscountType.FLAT) {
        text += ` 減 HK$ ${discount.discount}`
    }
    else if (discount.discountType === DiscountType.RATIO) {
        text += ` ${100 - discount.discount} 折`
    }

    return text
}