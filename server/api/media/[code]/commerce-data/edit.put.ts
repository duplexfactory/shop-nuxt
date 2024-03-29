import {defineEventHandler} from "h3";
import {assert, isOwnMedia, noCache} from "~/server/util";
import {Discount} from "~/models/Discount";
import {initMongo, mediaCommerceDataCollection} from "~/server/mongodb";

export default defineEventHandler(async (event) => {

    noCache(event);
    const {code} = event.context.params
    assert(code)
    const media = await isOwnMedia(event, code)
    assert(media)
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
    } = await readBody(event);

    let set = {
        _id: code,
        active,
        customPrice,
        stock,
        discount,
        pageId: media.pageId
    }
    let defaults = {
        active: false,
        customPrice: false
    }
    for (const key of Object.keys(set)) {
        if (set[key] == undefined) {
            delete set[key]
        }
        else {
            delete defaults[key]
        }
    }

    await initMongo();
    await mediaCommerceDataCollection.updateOne({
        _id: code
    }, {
        $set: set,
        $setOnInsert: defaults
    }, { upsert: true });

    return {
        success: true
    };

})
