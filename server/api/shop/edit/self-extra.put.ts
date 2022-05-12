import {defineEventHandler, JSONValue, sendError, useBody} from "h3";
import {assert, getAuth, noCache} from "~/server/util";
import IgPage from "~/models/IgPage";
import {igAuthCollection, initMongo, pageOverrideCollection, pageSearchCollection} from "~/server/mongodb";
import {notFound} from "~/utils/h3Error";
import {pageCollection} from "~/server/firebase/collections";
import IgPageExtraData from "~/models/IgPageExtraData";

export default defineEventHandler(async (event) => {
    noCache(event);
    const auth = getAuth(event);
    await initMongo();

    const igAuth = await igAuthCollection.findOne({
        userId: auth.uid
    });

    assert(event, igAuth, notFound);

    const extraData = await useBody<IgPageExtraData>(event);

    // Remove empty fields.
    Object.keys(extraData).forEach((k) => {
        if (extraData[k] === undefined)
            delete extraData[k];
    });

    // Upsert override data.
    await pageOverrideCollection.updateOne({
        _id: igAuth.pageId
    }, {
        $set: {
            extraData
        }
    }, {upsert: true});

    // Update the data directly before next crawl.
    const updateData = {};
    Object.keys(extraData).forEach((k) => {
        updateData[`extraData.${k}`] = extraData[k];
    });
    await pageSearchCollection.updateOne({
        _id: igAuth.pageId
    }, {
        $set: updateData
    }, {upsert: true});
    try {
        await pageCollection().doc(igAuth.pageId).update(updateData);
    }
    catch (e) {
        // Connected page not found.
        sendError(event, notFound);
    }

    return {
        success: true
    };
})