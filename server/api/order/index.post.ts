import {defineEventHandler, useBody} from "h3";
import Dict = NodeJS.Dict;
import IgMedia from "~/models/IgMedia";
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";
import {mediaPrice} from "~/utils/mediaPrice";
import {initMongo, orderCollection} from "~/server/mongodb";

export default defineEventHandler(async (event) => {

    const {
        items,
        mailingIndex,
        notes,
    } = await useBody<{
        items: {
            code: string,
            quantity: number
        }[],
        mailingIndex: Dict<string>,
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
    })
    const mediasGrouped: Dict<IgMedia[]> = (Object.values(medias) as IgMedia[]).reduce((previous, current) => {
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
    })

    console.log(shopCommerceData)

    await initMongo();
    await orderCollection.insertMany(Object.keys(mediasGrouped).map((pageId) => {
        return {
            // _id: ,
            created: Date.now(),
            medias: mediasGrouped[pageId].map((m) => {
                const item = items.find((item) => item.code === m.code)
                return {
                    ...item,
                    price: mediaPrice(m),
                    discount: mediaCommerceData[item.code].discount
                }
            }),
            discount: shopCommerceData[pageId].discount,
            mailing: shopCommerceData[pageId].mailing[mailingIndex[pageId]],
            mailingDiscount: shopCommerceData[pageId].discount,
            note: notes[pageId]
        }
    }));

    return {
        success: true
    }
});