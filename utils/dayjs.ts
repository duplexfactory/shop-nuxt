import dayjs from "dayjs"
import dDuration from "dayjs/plugin/duration"

dayjs.extend(dDuration)

export const duration = dayjs.duration
