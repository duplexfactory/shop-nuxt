import {Discount, DiscountType, MailingDiscount, ThresholdType} from "~/models/Discount";
import {OrderShopDetails} from "~/models/Order";
import {mediaPrice} from "~/utils/mediaPrice";

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



export function pageDiscountValue(orderShopDetails: OrderShopDetails) {
    const price = orderShopDetails.medias.map((m) => m.price * m.quantity - discountValue(m.discount, m.price * m.quantity, m.quantity))
        .reduce((previous, current) => previous += current, 0)
    const quantity = orderShopDetails.medias.map((m) => m.quantity).reduce((previous, current) => previous += current, 0)
    return discountValue(orderShopDetails.discount, price, quantity)
}

export function pageFreeMailing(orderShopDetails: OrderShopDetails) {
    const price = orderShopDetails.medias.map((m) => m.price * m.quantity - discountValue(m.discount, m.price * m.quantity, m.quantity))
        .reduce((previous, current) => previous += current, 0) - pageDiscountValue(orderShopDetails)
    const quantity = orderShopDetails.medias.map((m) => m.quantity).reduce((previous, current) => previous += current, 0)
    return isFreeMailing(orderShopDetails.mailingDiscount, price, quantity)
}

export function pageTotal(orderShopDetails: OrderShopDetails) {
    const price = orderShopDetails.medias.map((m) => mediaPrice(m) * m.quantity - discountValue(m.discount, m.price * m.quantity, m.quantity))
        .reduce((previous, current) => previous += current, 0)
    let mailingCost =  0
    if (!pageFreeMailing(orderShopDetails)) {
        if (!orderShopDetails.mailing.payOnArrive) {
            mailingCost = orderShopDetails.mailing.cost ?? 0
        }
    }
    return Math.max(price - pageDiscountValue(orderShopDetails) + mailingCost, 0)
}

