import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/ja";
dayjs.extend(isBetween);
dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);
dayjs.locale("ja");

export default dayjs;
