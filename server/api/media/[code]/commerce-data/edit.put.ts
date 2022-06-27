import {defineEventHandler, useBody} from "h3";
import {assert} from "~/server/util";
import {Discount} from "~/models/Discount";
import {initMongo, mediaCommerceDataCollection} from "~/server/mongodb";

export default defineEventHandler(async (event) => {
    const {code} = event.context.params
    assert(code)

    const {
        active,
        customPrice,
        stock,
        discount
    }: {
        active?: boolean;
        customPrice?: boolean;
        stock?: number;
        discount?: Discount;
    } = await useBody(event);

    await initMongo();
    await mediaCommerceDataCollection.updateOne({
        _id: code
    }, {
        $set: {
            _id: code,
            active,
            customPrice,
            stock,
            discount
        }
    }, { upsert: true });

    return {
        success: true
    };

})
