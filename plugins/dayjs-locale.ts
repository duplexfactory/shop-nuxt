import dayjs from "dayjs";
import "dayjs/locale/zh-hk";
import relativeTime from "dayjs/plugin/relativeTime.js";

export default function () {
    dayjs.locale('zh-hk');
    dayjs.extend(relativeTime);
}

