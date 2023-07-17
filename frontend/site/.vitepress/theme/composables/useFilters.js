import { computed, reactive, readonly } from "vue";

/**
 * 
 * @param {import("vue").UnwrapNestedRefs<Array<import("../types").Row>>} rows 
 * @returns 
 */
export default function useFilters(rows) {
    /** @type {import("vue").UnwrapNestedRefs<import("../types").FiltersMap>} */
    const filters = reactive(new Map([
        ["category", ""],
        ["organization", ""],
        ["status", ""],
        ["supervisor", ""],
        ["type", ""],
    ]));

    const filteredRows = computed(() => {
        return rows
            .filter((d) => !filters.get("type") || d.TYPE == filters.get("type"))
            .filter(
                (d) => !filters.get("status") || d.status.label == filters.get("status")
            )
            .filter((d) => !filters.get("organization") || d.PRODUCTEUR == filters.get("organization"))
            .filter(
                (d) => !filters.get("category") || d.CATEGORIE == filters.get("category")
            )
            .filter(
                (d) => !filters.get("supervisor") || d["MINISTÈRE DE TUTELLE"] == filters.get("supervisor")
            );
    });

    const organizations = computed(() => {
        const organizationNames = rows.map((row) => row.PRODUCTEUR);
        const orgs = Array.from(new Set(organizationNames))
            .map((name) => ({
                label: name,
                key: name,
                count: filteredRows.value.filter((/** @type {import("../types").Row} */ row) => row.PRODUCTEUR == name).length,
            }));
        orgs.sort((a, b) => b.count - a.count);
        return orgs;
    });

    const supervisors = computed(() => {
        const supervisorNames = rows.map((row) => row["MINISTÈRE DE TUTELLE"]);
        const orgs = Array.from(new Set(supervisorNames))
            .map((name) => ({
                label: name,
                key: name,
                count: filteredRows.value.filter((/** @type {import("../types").Row} */ row) => row["MINISTÈRE DE TUTELLE"] == name).length,
            }));
        orgs.sort((a, b) => b.count - a.count);
        return orgs;
    });

    const categories = computed(() => {
        const categories = Array.from(new Set(rows.map((/** @type {import("../types").Row} */ row) => row.CATEGORIE)));
        return categories.map((type) => ({ label: type, key: type }));
    });

    /** @type {import("vue").ComputedRef<Array<import("../types").Option>>} */
    const types = computed(() => {
        const types = Array.from(new Set(rows.map((/** @type {import("../types").Row} */ row) => row.TYPE)));
        return types.map((type) => ({ label: type, key: type }));
    });

    /**
     * Update filters after select event
     * @param {Record<import("../types").Filters, string>} newFilters 
     */
    const updateFilters = (newFilters) => {
        filters.set("organization", newFilters.organization);
        filters.set("status", newFilters.status);
        filters.set("category", newFilters.category);
        filters.set("supervisor", newFilters.supervisor);
        filters.set("type", newFilters.type);
    }

    /**
     * Reset filters
     */
    const resetFilters = () => {
        filters.set("organization", "");
        filters.set("status", "");
        filters.set("category", "");
        filters.set("supervisor", "");
        filters.set("type", "");
    }

    /**
     * Update filters after select event
     * @param {Map<string, string>} map 
     */
    const updateFiltersFromMap = (map) => {
        for (const key of filters.keys()) {
            let newValue;
            if (newValue = map.get(key)) {
                filters.set(key, newValue);
            }
        }
    }

    return {
        categories,
        filteredRows,
        filters: readonly(filters),
        organizations,
        resetFilters,
        supervisors,
        types,
        updateFilters,
        updateFiltersFromMap,
    };
}