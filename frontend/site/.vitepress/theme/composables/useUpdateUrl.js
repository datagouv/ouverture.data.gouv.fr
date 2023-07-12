/**
 * 
 * @param {import("vue").DeepReadonly<import("vue").UnwrapNestedRefs<import("../types").FiltersMap>>} filters 
 * @param {import("vue").Ref<string | null>} nextCursor 
 * @returns 
 */
export default function useUpdateUrl(filters, nextCursor) {
    const SAVE_TO_HISTORY = true;
    const DONT_SAVE_TO_HISTORY = false;
    const NEXT_CURSOR = "nextCursor";

    const updateUrl = (save = SAVE_TO_HISTORY) => {
        /** @type {Record<string, string>} */
        let params = {};
        for (let key of filters.keys()) {
            let value;
            if (value = filters.get(key)) {
                params[key] = value;
            }
        }
        if (nextCursor.value) {
            params[NEXT_CURSOR] = nextCursor.value;
        }

        // Update URL to match current search params value for deep linking
        const url = new URL(window.location.href);
        url.search = new URLSearchParams(params).toString();
        if (save) {
            window.history.pushState(null, "", url);
        }
    };

    return {
        DONT_SAVE_TO_HISTORY,
        NEXT_CURSOR,
        SAVE_TO_HISTORY,
        getSearchParams,
        updateUrl,
    };
}

export function getSearchParams() {
    const url = new URL(window.location.href);
    return new Map(new URLSearchParams(url.search));
}