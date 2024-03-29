interface _IgPageExtraData {
    phone: string,
    whatsapp: string,
    wechat: string,
    signal: string,
    email: string,
    address: string,
    openHours: string,
    link: string, // IgPage.externalUrl
    relatedPage: string,
    br: boolean, // IgPage.businessRegistration
    paymentMethods: string[],
    mailing: string[],
    noPhoneCall: boolean,
    noIgDM: boolean,
    facebook: string,
    noRefund: boolean,
    discount: string,
    shopSince: string,
    licence: string | boolean
}

type IgPageExtraData = Partial<_IgPageExtraData>;
export default IgPageExtraData;
