import {CompatibilityEvent, createError, H3Error} from "h3"
import {badRequest, notFound} from "~/utils/h3Error"
import type {DecodedIdToken} from "firebase-admin/auth"
import {igAuthCollection, initMongo} from "~/server/mongodb";
import {getMediaByCode, initDynamo} from "~/server/dynamodb";
import IgMedia from "~/models/IgMedia";

// Send email.
import * as nodemailer from "nodemailer";
import {SendMailOptions} from "nodemailer";
import {OrderStatus} from "~/models/Order";
import template from "~/server/email-templates/order-notification";
import dayjs from "dayjs";
import {orderStatusToText} from "~/data/commerce";
import {PaymentType} from "~/models/IgPageCommerceData";

export function noCache(event: CompatibilityEvent) {
    event.res.setHeader("Cache-Control", "no-cache")
}

export function assert(condition: any, error: H3Error = badRequest): asserts condition {
    if (!condition) throw error
}

export function guard(condition: any, error: H3Error = badRequest) {
    if (condition) throw error
}

export function getAuth(event: CompatibilityEvent, block = true) {
    if (!event.context.auth && block) throw createError({statusCode: 401, statusMessage: "Not Authorized"})
    return event.context.auth as DecodedIdToken
}

export async function isOwnMedia(event: CompatibilityEvent, code: string): Promise<IgMedia | null> {
    const auth = getAuth(event)
    await initMongo()
    const igAuth = await igAuthCollection.findOne({
        userId: auth.uid
    })
    if (!igAuth) {
        return null
    }
    initDynamo()
    const media = await getMediaByCode(code)
    assert(media, notFound)
    if (media.pageId !== igAuth.pageId) {
        return null
    }
    return media
}


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

export async function sendMail(config: SendMailOptions) {
    return transporter.sendMail(config);
}

export async function sendOrderNotificationEmail(email: string, orderId: string, orderCreated: number, orderStatus: OrderStatus, orderTotal: number, paymentMethod?: PaymentType) {

    if (![OrderStatus.VERIFIED, OrderStatus.TB_VERIFIED].includes(orderStatus)) {
        // Only send order notification email for these status.
        return
    }

    let subject = `[訂單${orderStatusToText[orderStatus]}] 訂單ID: ${orderId}`
    await sendMail({
        from: process.env.NO_REPLY_EMAIL,
        to: email,
        subject,
        html: orderNotificationEmailTemplate(orderId, orderCreated, orderStatus, orderTotal, paymentMethod)
    });
}

function orderNotificationEmailTemplate(orderId: string, orderCreated: number, orderStatus: OrderStatus, orderTotal: number, paymentMethod?: PaymentType) {
    const t = template
        .replace("__order_id__", orderId)
        .replace("__order_date__", dayjs(orderCreated).format('DD/MM/YYYY'))
        .replace("__order_status__", orderStatusToText[orderStatus])
        .replace("__link__", `${process.env.DOMAIN}/my/order/${orderId}`)
        .replace("__order_total__", orderTotal.toString())

    if (orderStatus === OrderStatus.VERIFIED) {
        return t
            .replace("__t1__", "買家已付款，請按「查看訂單詳情」以獲取下一步指示。")
    }
    else if (orderStatus === OrderStatus.TB_VERIFIED) {
        if (paymentMethod === PaymentType.IN_PERSON) {
            return t
                .replace("__t1__", "買家選擇親身付款，請按「查看訂單詳情」以獲取下一步指示。")
        }
        else {
            return t
                .replace("__t1__", "買家已提交了付款證明，請按「查看訂單詳情」以獲取下一步指示。")
        }
    }
    return ""
}

