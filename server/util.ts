import {CompatibilityEvent} from "h3";

export function noCache(event: CompatibilityEvent) {
    event.res.setHeader("Cache-Control", "no-cache");
}
