import {Discount, DiscountType, ThresholdType} from "~/models/Discount";

export function discountValue(discount?: Discount, value: number, quantity: number) {
    if (!discount || (!!discount.deadline && discount.deadline < Date.now())) {
        return 0
    }
    let thresholdPassed = false
    if (discount.thresholdcType === ThresholdType.VALUE) {
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