import {NitroFetchRequest} from "nitropack";
import {FetchResult, UseFetchOptions} from "nuxt/dist/app/composables/fetch";
import {AsyncData, KeyOfRes, PickFrom} from "nuxt/dist/app/composables/asyncData";
import {Ref} from "vue";
import {hash} from "ohash";

export default function <ResT = void, ErrorT = Error, ReqT extends NitroFetchRequest = NitroFetchRequest, _ResT = ResT extends void ? FetchResult<ReqT> : ResT, Transform extends (res: _ResT) => any = (res: _ResT) => _ResT, PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>>(request: Ref<ReqT> | ReqT | (() => ReqT), opts?: Omit<UseFetchOptions<_ResT, Transform, PickKeys>, 'lazy'>): AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, ErrorT | null | true> {
    return useLazyFetch(request, {
        key: hash(['api-fetch', request, opts]),
        ...opts
    })
}