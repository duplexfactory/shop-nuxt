import IgPageExtraData from "~/models/IgPageExtraData";

export const extraDataLookup = {
    "phone": {
        title: "電話號碼",
        iconClass: "spr-phone",
    },
    "whatsapp": {
        title: "WhatsApp",
        iconClass: "spr-whatsapp",
    },
    "wechat": {
        title: "WeChat",
        iconClass: "spr-wechat",
    },
    "signal": {
        title: "Signal",
        iconClass: "spr-signal",
    },
    "email": {
        title: "電郵",
        iconClass: "spr-mail-alt",
    },
    "address": {
        title: "地址",
        iconClass: "spr-location",
    },
    "openHours": {
        title: "營業時間",
        iconClass: "spr-clock",
    },
    "link": {
        title: "連結",
        iconClass: "spr-link",
    },
    "relatedPage": {
        title: "相關IG",
        iconClass: "spr-instagram",
    },
    "facebook": {
        title: "Facebook",
        iconClass: "spr-facebook-squared",
    },
    "discount": {
        title: "折扣",
        iconClass: "spr-tag",
    },
    "shopSince": {
        title: "Shop Since",
        iconClass: "spr-calendar-empty",
    },
    "br": {
        title: "持商業登記",
        iconClass: "spr-doc-text-inv",
    },
    "noRefund": {
        title: "不設退款",
        iconClass: "spr-block",
    },
    "noIgDM": {
        title: "不回IG DM",
        iconClass: "spr-block",
    },
    "noPhoneCall": {
        title: "不接來電",
        iconClass: "spr-block",
    },
    "paymentMethods": {
        title: "付款方法",
        iconClass: "spr-money",
    },
    "mailing": {
        title: "郵寄",
        iconClass: "spr-paper-plane",
    },
    "licence": {
        title: "持有牌照",
        iconClass: "spr-id-card",
    },
} as Record<keyof IgPageExtraData, { title: string, iconClass: string }>

export default class PageInfoRow {
    key: keyof IgPageExtraData;
    iconClass: string;
    value: string;
    link?: string;
    constructor(key: keyof IgPageExtraData, iconClass: string, value: string, link?: string) {
        this.key = key;
        this.iconClass = iconClass;
        this.value = value;
        this.link = link;
    }

    static rowsFromExtraData(extraData: IgPageExtraData, fields: (keyof IgPageExtraData)[]): PageInfoRow[] {
        const extraDataCopy = {};
        for (const k of Object.keys(extraData) as (keyof IgPageExtraData)[]) {
            if (fields.includes(k)) {
                extraDataCopy[k] = extraData[k]
            }
        }

        return PageInfoRow.rowsFromPage({
            businessRegistration: false,
            locations: [],
            extraData: extraDataCopy,
        });
    }

    static rowsFromPage(page: {businessRegistration: boolean, locations: string[], extraData?: IgPageExtraData}): PageInfoRow[] {
        const extraData = page.extraData;
        if (!!extraData) {
            const rows = [];
            // Contact
            function formattedPhone(phone:string): string {
                const strippedPhone = (phone.length === 11 && phone.startsWith("852")) ? phone.slice(3, 11) : phone;
                if (strippedPhone.length === 8) {
                    return strippedPhone.slice(0, 4) + " " + strippedPhone.slice(4, 8);
                }
                return strippedPhone
            }
            let phone = "";
            if (!!extraData.phone)
                phone += `${formattedPhone(extraData.phone)} `;
            if (extraData.noPhoneCall)
                phone += "不接來電";
            if (phone.length !== 0)
                rows.push(new PageInfoRow("phone", "spr-phone", phone));

            if (!!extraData.whatsapp)
                rows.push(new PageInfoRow("whatsapp", "spr-whatsapp", formattedPhone(extraData.whatsapp), `https://api.whatsapp.com/send/?phone=${extraData.whatsapp.length == 8 ? '852' : ''}${extraData.whatsapp}`))
            if (!!extraData.signal)
                rows.push(new PageInfoRow("signal", "spr-signal", formattedPhone(extraData.signal), `https://signal.me/#p/+${extraData.signal}`),);
            if (!!extraData.wechat)
                rows.push(new PageInfoRow("wechat", "spr-wechat", formattedPhone(extraData.wechat)),);
            if (!!extraData.email)
                rows.push(new PageInfoRow("email", "spr-mail-alt", formattedPhone(extraData.email)),);

            // Brick and mortar
            if (!!extraData.address) {
                rows.push(
                    new PageInfoRow("address", "spr-location", extraData.address, `https://google.com/maps/search/?api=1&query=${encodeURIComponent(extraData.address)}`),
                )
            }
            else if (!!page && page.locations.length !== 0) {
                rows.push(
                    new PageInfoRow("address", "spr-location", page.locations.join('、')),
                )
            }
            if (!!extraData.openHours)
                rows.push(new PageInfoRow("openHours", "spr-clock", extraData.openHours))

            // Proof
            if (page.businessRegistration)
                rows.push(new PageInfoRow("br", "spr-doc-text-inv", "持商業登記"))

            if (!!extraData.licence) {
                if (extraData.licence === true)
                    rows.push(new PageInfoRow("licence", "spr-id-card", "持有牌照"))
                else
                    rows.push(new PageInfoRow("licence", "spr-id-card", `牌照號碼 ${extraData.licence}`))
            }

            // Purchase
            let purchase = "";
            if (!!extraData.paymentMethods && extraData.paymentMethods.length !== 0)
                purchase = `接受 ${extraData.paymentMethods.join('、')} `;
            if (!!extraData.noRefund)
                purchase += "（不設退款）";
            if (purchase.length !== 0)
                rows.push(new PageInfoRow("paymentMethods", "spr-money", purchase));
            if (!!extraData.mailing && extraData.mailing.length !== 0)
                rows.push(new PageInfoRow("mailing", "spr-paper-plane", extraData.mailing.join("、"))); // 全球免郵之類
            if (!!extraData.discount)
                rows.push(new PageInfoRow("discount", "spr-tag", extraData.discount)); // 全單8折

            // Links
            if (!!extraData.link)
                rows.push(new PageInfoRow("link", "spr-link", extraData.link, extraData.link));
            if (!!extraData.relatedPage)
                rows.push(new PageInfoRow("relatedPage", "spr-instagram", `${extraData.relatedPage}`, `https://www.instagram.com/${extraData.relatedPage.replace("@", "")}/`));
            if (!!extraData.facebook)
                rows.push(new PageInfoRow("facebook", "spr-facebook-squared", extraData.facebook, extraData.facebook));

            // Other info
            if (!!extraData.shopSince)
                rows.push(new PageInfoRow("shopSince", "spr-calendar-empty", `Since ${extraData.shopSince}`))
            if (extraData.noIgDM)
                rows.push(new PageInfoRow("noIgDM", "spr-block", "不回IG DM"))

            return rows;
        }
        return [];
    }
}
