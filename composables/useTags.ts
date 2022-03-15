import {categories} from "~/data/categories";

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
