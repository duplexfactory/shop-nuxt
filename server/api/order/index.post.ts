import {defineEventHandler, useBody} from "h3";
import IgMedia from "~/models/IgMedia";
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";
import {mediaPrice} from "~/utils/mediaPrice";
import {igAuthCollection, initMongo, orderCollection} from "~/server/mongodb";
import {Order, OrderStatus} from "~/models/Order";
import {IgPageCommerceData} from "~/models/IgPageCommerceData";
import {pageTotal} from "~/utils/discountValue";
import Dict = NodeJS.Dict;
import {sendOrderNotificationEmail} from "~/server/util";
import {getAuth} from "firebase-admin/auth";

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

    const created = Date.now()

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

    const pageIds = Object.keys(mediasGrouped)
    const {
        commerceData: shopCommerceData,
    } = await $fetch("/api/shop/commerce-data", {
        params: {ids: pageIds.join(",")}
    }) as {
        commerceData: Dict<IgPageCommerceData>
    }

    await initMongo();
    const order = {
        created,
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
    }
    const orderInsertOneResult = await orderCollection.insertOne(order);

    if (!!pageIds.length) {
        // Send email notification to shop owners.
        const igAuths = await igAuthCollection.find({
            pageId: {$in: pageIds}
        }).toArray()
        const getUsersRes = await getAuth().getUsers(igAuths.map((auth) => ({uid: auth.userId})))
        const uidMap = igAuths.reduce((prev, current) => {
            prev[current.pageId] = current.userId
            return prev
        }, {})
        const emailMap = getUsersRes.users.reduce((prev, current) => {
            prev[current.uid] = current.email
            return prev
        }, {})

        for (const pageId of pageIds) {
            if (!!uidMap[pageId] && !!emailMap[uidMap[pageId]]) {
                const email = emailMap[uidMap[pageId]]
                await sendOrderNotificationEmail(email, orderInsertOneResult.insertedId.toString(), created, order.shops[pageId].orderStatus, pageTotal(order.shops[pageId]))
            }
        }
    }

    return {
        success: true,
        id: orderInsertOneResult.insertedId.toString()
    }
});
