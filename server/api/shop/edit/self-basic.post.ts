import {defineEventHandler, JSONValue, sendError, useBody} from "h3";
import {assert, getAuth, noCache} from "~/server/util";
import IgPage from "~/models/IgPage";
import {igAuthCollection, initMongo, pageOverrideCollection, pageSearchCollection} from "~/server/mongodb";
import {notFound} from "~/utils/h3Error";
import {pageCollection} from "~/server/firebase/collections";

export default defineEventHandler(async (event) => {
    noCache(event);
    const auth = getAuth(event);

    const igAuth = await igAuthCollection.findOne({
        userId: auth.uid
    });

    assert(event, igAuth, notFound);

    const {
        username,
        fullName,
        biography,
        tags
    } = await useBody<Partial<Pick<IgPage, "username" | "fullName" | "biography" | "tags">>>(event);

    const updateData = {
        username,
        fullName,
        biography,
        tags
    };
    // Remove empty fields.
    Object.keys(updateData).forEach((k) => {
        if (updateData[k] === undefined)
            delete updateData[k];
    });

    // Upsert override data.
    await initMongo();
    await pageOverrideCollection.updateOne({
        _id: igAuth.pageId
    }, {
        $set: updateData
    }, {upsert: true});

    // Update the data directly before next crawl.
    await pageSearchCollection.updateOne({
        _id: igAuth.pageId
    }, {
        $set: updateData
    });
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