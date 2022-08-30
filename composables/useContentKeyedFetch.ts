import {hash} from "ohash";
import {NitroFetchRequest} from "nitropack";
import {AsyncData, KeyOfRes, PickFrom} from "nuxt/dist/app/composables/asyncData";
import {Ref} from "vue";
import {FetchResult, UseFetchOptions} from "nuxt/dist/app/composables/fetch";

export default function <ResT = void, ErrorT = Error, ReqT extends NitroFetchRequest = NitroFetchRequest, _ResT = ResT extends void ? FetchResult<ReqT> : ResT, Transform extends (res: _ResT) => any = (res: _ResT) => _ResT, PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>>(request: Ref<ReqT> | ReqT | (() => ReqT), opts?: UseFetchOptions<_ResT, Transform, PickKeys>): AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, ErrorT | null | true> {
    return useFetch(request, {
        key: hash(['api-fetch', request, opts]),
        ...opts
    })
}