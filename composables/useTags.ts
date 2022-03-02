const categories = [{
    "id": "hand-made",
    "label": "手作",
    "tags": [
        {"id": "candle", "label": "蠟燭"},
        {"id": "bracelet-macrame", "label": "手繩"},
        {"id": "preserved-flower", "label": "永生花"},
        {"id": "leather", "label": "皮革"}
    ]
}, {
    "id": "apparel",
    "label": "服飾",
    "keywords": ["衣服"],
    "tags": [
        {"id": "men's", "label": "男裝"},
        {"id": "women's-clothing", "label": "女裝"},
        {"id": "cap", "label": "帽"},
        {"id": "shoe", "label": "鞋"},
        {"id": "adornment", "label": "首飾"},
        {"id": "famous-brand", "label": "名牌"},
        {"id": "bag", "label": "袋"},
        {"id": "suit", "label": "西裝"},
        {"id": "jewelry", "label": "珠寶"},
        {"id": "underwear", "label": "內衣"},
        {"id": "vintage", "label": "古著", "keywords": ["二手", "服"]},
        {"id": "accessories", "label": "飾物", "keywords": {or: ["耳環", "髮夾", "頭箍", "手飾", "戒指", "手鏈", "頸鏈"]}},
    ]
}, {
    "id": "cosmetic",
    "label": "美容",
    "tags": [
        {"id": "nail", "label": "美甲", "keywords": {or: ["修甲", "gel甲", "Gel甲"]}},
        {"id": "skin-care", "label": "護膚"}
    ]
}, {
    "id": "food",
    "label": "食物",
    "disabled": true,
    "tags": [
        {"id": "farewell-cake", "label": "散水餅"},
        {"id": "cake", "label": "蛋糕"},
        {"id": "tea", "label": "茶"},
        {"id": "manual-beer", "label": "手工啤酒"},
        {"id": "soup-bag", "label": "湯包"}
    ]
}, {
    "id": "serve",
    "label": "服務",
    "disabled": true,
    "tags": [
        {"id": "hairstyle", "label": "髮型屋", "keywords": {or: ["理髮", "剪髮"]}},
        {"id": "workshop", "label": "工作坊"},
        {"id": "self-service", "label": "自拍舘", "keywords": "攝影"}
    ]
}, {
    "id": "stationery-boutique",
    "label": "文具精品",
    "tags": [
        {"id": "phone-case", "label": "手機殼"},
        {"id": "watch", "label": "手錶"},
        {"id": "stationery", "label": "文具"},
        {"id": "model", "label": "模型"},
        {"id": "periphery", "label": "周邊"},
        {"id": "wallet", "label": "銀包"},
        {"id": "computer-bag", "label": "電腦袋"}
    ]
}, {
    "id": "pet",
    "label": "寵物",
    "disabled": true,
    "tags": [
        {"id": "pet-supplies", "label": "寵物用品", "keywords": {or: [["寵", "品"], ["寵", "具"]]}},
        {"id": "pet-food", "label": "寵物食品", "keywords": {or: [["寵", "食"], "飼料"]}}
    ]
}, {
    "id": "adult-products",
    "label": "成人用品",
    "adult": true,
    "tags": [
        {"id": "sex-toys", "label": "性玩具", "keywords": [{or: ["成人", "性", "情趣"]}, {or: ["用品", "玩具"]}]},
        {"id": "sexy-underwear", "label": "情趣內衣", "keywords": "情趣内衣"},
        {"id": "condom", "label": "安全套"}
    ]
}, {
    "id": "universal",
    "label": "通用",
    "disabled": true,
    "tags": [
        {"id": "south-korea", "label": "韓國", "keywords": {or: ["韓國", "韓式"]}},
        {"id": "japan", "label": "日本"},
        {"id": "purchase", "label": "代購"},
        {"id": "second-hand", "label": "二手"},
        {"id": "customize", "label": "訂製"}
    ]
}];

const tagsLookup = categories.reduce((dict, cat) => {
    dict[cat.id] = cat.label;
    for (const t of cat.tags)
        dict[t.id] = t.label;
    return dict;
}, {} as Record<string, string>)

import {useShowAgeRestrictedContent} from "~/composables/states";

export default function () {

    const showAgeRestrictedContent = useShowAgeRestrictedContent();

    const ageRestrictedCategories = computed(() => categories.filter((c) => showAgeRestrictedContent.value || c["adult"] == false || c["adult"] == undefined))

    return {
        categories,
        ageRestrictedCategories,
        tagsLookup
    };
}
