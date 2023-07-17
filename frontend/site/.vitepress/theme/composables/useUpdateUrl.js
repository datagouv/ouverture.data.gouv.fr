/**
 * 
 * @param {import("vue").DeepReadonly<import("vue").UnwrapNestedRefs<import("../types").FiltersMap>>} filters 
 * @returns 
 */
export default function useUpdateUrl(filters) {
    const SAVE_TO_HISTORY = true;
    const DONT_SAVE_TO_HISTORY = false;

    const updateUrl = (save = SAVE_TO_HISTORY) => {
        /** @type {Record<string, string>} */
        let params = {};
        for (let key of filters.keys()) {
            let value;
            if (value = filters.get(key)) {
                params[key] = value;
            }
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
        SAVE_TO_HISTORY,
        getSearchParams,
        updateUrl,
    };
}

export function getSearchParams() {
    const url = new URL(window.location.href);
    return new Map(new URLSearchParams(url.search));
}