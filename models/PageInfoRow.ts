import IgPageExtraData from "~/models/IgPageExtraData";
import IgPage from "~/models/IgPage";

export default class PageInfoRow {
    iconClass: string;
    value: string;
    link?: string;
    constructor(iconClass: string, value: string, link?: string) {
        this.iconClass = iconClass;
        this.value = value;
        this.link = link;
    }

    static rowsFromPage(page: IgPage): PageInfoRow[] {
        const extraData = page.extraData;
        if (!!extraData) {
            const rows = [];
            // Contact
            let phone = "";
            if (!!extraData.phone)
                phone += `${extraData.phone} `;
            if (extraData.noPhoneCall)
                phone += "不接來電";
            if (phone.length !== 0)
                rows.push(new PageInfoRow("sio-phone", phone));

            if (!!extraData.whatsapp)
                rows.push(new PageInfoRow("sio-whatsapp", extraData.whatsapp, `https://api.whatsapp.com/send/?phone=${extraData.whatsapp.length == 8 ? '852' : ''}${extraData.whatsapp}`))
            if (!!extraData.signal)
                rows.push(new PageInfoRow("", `Signal ${extraData.signal}`, `https://signal.me/#p/+${extraData.signal}`),);
            if (!!extraData.wechat)
                rows.push(new PageInfoRow("sio-wechat", extraData.wechat),);
            if (!!extraData.email)
                rows.push( new PageInfoRow("sio-mail-alt", extraData.email),);

            // Brick and mortar
            if (!!extraData.address) {
                rows.push(
                    new PageInfoRow("sio-location", extraData.address, `https://google.com/maps/search/${encodeURIComponent(extraData.address)}`),
                )
            }
            else if (!!page && page.locations.length !== 0) {
                rows.push(
                    new PageInfoRow("sio-location", page.locations.join('、')),
                )
            }
            if (!!extraData.openHours)
                rows.push(new PageInfoRow("sio-clock", extraData.openHours))

            // Proof
            if (page.businessRegistration)
                rows.push(new PageInfoRow("sio-doc-text-inv", "持商業登記"))

            if (!!extraData.foodLicence) {
                if (extraData.foodLicence === true)
                    rows.push(new PageInfoRow("sio-id-card", "持食物製造牌照"))
                else
                    rows.push(new PageInfoRow("sio-id-card", `食物製造牌照號碼 ${extraData.foodLicence}`))
            }

            // Purchase
            let purchase = "";
            if (!!extraData.paymentMethods && extraData.paymentMethods.length !== 0)
                purchase = `接受 ${extraData.paymentMethods.join('、')} `;
            if (!!extraData.refund)
                purchase += `（${extraData.refund}）`;
            if (purchase.length !== 0)
                rows.push(new PageInfoRow("sio-money", purchase));
            if (!!extraData.mailing)
                rows.push(new PageInfoRow("sio-paper-plane", extraData.mailing)); // 全球免郵之類
            if (!!extraData.discount)
                rows.push(new PageInfoRow("", extraData.discount)); // 全單8折

            // Links
            if (!!extraData.link)
                rows.push(new PageInfoRow("sio-link", extraData.link, extraData.link));
            if (!!extraData.relatedPage)
                rows.push(new PageInfoRow("sio-instagram", `@${extraData.relatedPage}`, `https://www.instagram.com/${extraData.relatedPage}/`));
            if (!!extraData.facebook)
                rows.push(new PageInfoRow("sio-facebook-squared", extraData.facebook, `https://www.facebook.com/${extraData.facebook}/`));

            // Other info
            if (!!extraData.shopSince)
                rows.push(new PageInfoRow("sio-calendar-empty", `Since ${extraData.shopSince}`))
            if (extraData.noIgDM)
                rows.push(new PageInfoRow("", "不回IG DM"))

            return rows;
        }
        return [];
    }
}
