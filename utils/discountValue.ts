import {Discount, DiscountType, MailingDiscount, ThresholdType} from "~/models/Discount";

export function discountValue(discount: Discount | undefined, value: number, quantity: number) {
    if (!discount || (!!discount.deadline && discount.deadline < Date.now())) {
        return 0
    }
    let thresholdPassed = false
    if (discount.thresholdType === ThresholdType.VALUE) {
        thresholdPassed = value >= discount.threshold
    }
    else if (discount.thresholdType === ThresholdType.COUNT){
        thresholdPassed = quantity >= discount.threshold
    }
    if (!thresholdPassed) {
        return 0
    }
    return discount.discountType === DiscountType.FLAT ? discount.discount : value * discount.discount / 100
}

export function isFreeMailing(discount: MailingDiscount | undefined, value: number, quantity: number) {
    if (!discount) {
        return false
    }
    let thresholdPassed = false
    if (discount.thresholdType === ThresholdType.VALUE) {
        thresholdPassed = value >= discount.threshold
    }
    else if (discount.thresholdType === ThresholdType.COUNT){
        thresholdPassed = quantity >= discount.threshold
    }
    return thresholdPassed
}
