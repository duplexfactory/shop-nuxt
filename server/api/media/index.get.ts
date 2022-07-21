import {defineEventHandler, useQuery} from "h3";
import {getMediaByCode, getMediasByCodes, initDynamo} from "~/server/dynamodb";
import {assert} from "~/server/util";
import {badRequest, notFound} from "~/utils/h3Error";

export default defineEventHandler(async (event) => {
    let {
        codes
    } = await useQuery(event) as { codes: string }

    assert(!!codes, badRequest)

    initDynamo()

    const medias = await getMediasByCodes(codes.split(","))
    assert(medias.length !== 0, notFound)

    return {
        medias: medias.reduce((previous, current) => {
            previous[current.code] = current
            return previous;
        }, {})
    };
})