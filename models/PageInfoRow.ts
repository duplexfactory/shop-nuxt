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
                rows.push(new PageInfoRow("spr-phone", phone));

            if (!!extraData.whatsapp)
                rows.push(new PageInfoRow("spr-whatsapp", extraData.whatsapp, `https://api.whatsapp.com/send/?phone=${extraData.whatsapp.length == 8 ? '852' : ''}${extraData.whatsapp}`))
            if (!!extraData.signal)
                rows.push(new PageInfoRow("spr-signal", extraData.signal, `https://signal.me/#p/+${extraData.signal}`),);
            if (!!extraData.wechat)
                rows.push(new PageInfoRow("spr-wechat", extraData.wechat),);
            if (!!extraData.email)
                rows.push( new PageInfoRow("spr-mail-alt", extraData.email),);

            // Brick and mortar
            if (!!extraData.address) {
                rows.push(
                    new PageInfoRow("spr-location", extraData.address, `https://google.com/maps/search/${encodeURIComponent(extraData.address)}`),
                )
            }
            else if (!!page && page.locations.length !== 0) {
                rows.push(
                    new PageInfoRow("spr-location", page.locations.join('、')),
                )
            }
            if (!!extraData.openHours)
                rows.push(new PageInfoRow("spr-clock", extraData.openHours))

            // Proof
            if (page.businessRegistration)
                rows.push(new PageInfoRow("spr-doc-text-inv", "持商業登記"))

            if (!!extraData.licence) {
                if (extraData.licence === true)
                    rows.push(new PageInfoRow("spr-id-card", "持有牌照"))
                else
                    rows.push(new PageInfoRow("spr-id-card", `牌照號碼 ${extraData.licence}`))
            }

            // Purchase
            let purchase = "";
            if (!!extraData.paymentMethods && extraData.paymentMethods.length !== 0)
                purchase = `接受 ${extraData.paymentMethods.join('、')} `;
            if (!!extraData.noRefund)
                purchase += "（不設退款）";
            if (purchase.length !== 0)
                rows.push(new PageInfoRow("spr-money", purchase));
            if (!!extraData.mailing)
                rows.push(new PageInfoRow("spr-paper-plane", extraData.mailing.join("、"))); // 全球免郵之類
            if (!!extraData.discount)
                rows.push(new PageInfoRow("spr-tag", extraData.discount)); // 全單8折

            // Links
            if (!!extraData.link)
                rows.push(new PageInfoRow("spr-link", extraData.link, extraData.link));
            if (!!extraData.relatedPage)
                rows.push(new PageInfoRow("spr-instagram", `@${extraData.relatedPage}`, `https://www.instagram.com/${extraData.relatedPage}/`));
            if (!!extraData.facebook)
                rows.push(new PageInfoRow("spr-facebook-squared", extraData.facebook, `https://www.facebook.com/${extraData.facebook}/`));

            // Other info
            if (!!extraData.shopSince)
                rows.push(new PageInfoRow("spr-calendar-empty", `Since ${extraData.shopSince}`))
            if (extraData.noIgDM)
                rows.push(new PageInfoRow("spr-block", "不回IG DM"))

            return rows;
        }
        return [];
    }
}
