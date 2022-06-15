enum ThresholdType {
    COUNT,
    VALUE
}

enum DiscountType {
    FLAT,
    RATIO
}

export interface Discount {
    title?: string;
    thresholdType: ThresholdType; // COUNT, VALUE
    discountType: DiscountType; // FLAT, RATIO
    threshold: number;
    discount: number;
    deadline?: number;
}

export interface MailingDiscount {
    title?: string;
    thresholdType: ThresholdType; // COUNT, VALUE
    threshold: number;
}
