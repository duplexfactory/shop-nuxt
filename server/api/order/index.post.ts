import {defineEventHandler, useBody} from "h3";
import IgMedia from "~/models/IgMedia";
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";
import {mediaPrice} from "~/utils/mediaPrice";
import {initMongo, orderCollection} from "~/server/mongodb";
import {Order, OrderStatus} from "~/models/Order";
import {IgPageCommerceData} from "~/models/IgPageCommerceData";
import {pageTotal} from "~/utils/discountValue";
import Dict = NodeJS.Dict;

export default defineEventHandler(async (event) => {

    const {
        items,
        mailingIndex,
        mailingInfo,
        notes,
    } = await useBody<{
        items: {
            code: string,
            quantity: number
        }[],
        mailingIndex: Dict<string>,
        mailingInfo: Dict<{
            [key:number]: string
        }>,
        notes: Dict<string>
    }>(event);

    const {
        data: mediaCommerceData,
    } = await $fetch("/api/media/commerce-data", {
        params: {
            codes: items.map((item) => item.code).join(",")
        }
    }) as {
        data: Dict<IgMediaCommerceData>
    }

    const {
        medias,
    } = await $fetch("/api/media", {
        params: {
            codes: items.map((item) => item.code).join(",")
        }
    }) as {
        medias: Dict<IgMedia>,
    }
    const mediasGrouped: Dict<IgMedia[]> = (Object.values(medias)).reduce((previous, current) => {
        if (!previous[current.pageId]) {
            previous[current.pageId] = []
        }
        previous[current.pageId].push(current)
        return previous
    }, {})

    const {
        commerceData: shopCommerceData,
    } = await $fetch("/api/shop/commerce-data", {
        params: {ids: Object.keys(mediasGrouped).join(",")}
    }) as {
        commerceData: Dict<IgPageCommerceData>
    }

    await initMongo();
    const orderInsertOneResult = await orderCollection.insertOne({
        created: Date.now(),
        shops: Object.keys(mediasGrouped).reduce((previous, currentPageId) => {
            previous[currentPageId] = {
                medias: mediasGrouped[currentPageId].map((m) => ({
                    code: m.code,
                    price: mediaPrice(m),
                    discount: mediaCommerceData[m.code].discount,
                    quantity: items.find((item) => item.code === m.code).quantity
                })),
                discount: shopCommerceData[currentPageId].discount,
                mailing: shopCommerceData[currentPageId].mailing[mailingIndex[currentPageId]],
                mailingInfo: mailingInfo[currentPageId],
                mailingDiscount: shopCommerceData[currentPageId].mailingDiscount,
                note: notes[currentPageId],
                orderStatus: OrderStatus.PENDING,
            }

            // Free orders.
            if (pageTotal(previous[currentPageId]) === 0) {
                previous[currentPageId].orderStatus = OrderStatus.VERIFIED
            }

            return previous
        }, {} as Order["shops"])
    });

    return {
        success: true,
        id: orderInsertOneResult.insertedId.toString()
    }
});
