import axios from "axios";
import { useData } from "vitepress";
import { onMounted, reactive, ref } from "vue";

/**
 * Request data from API endpoint
 * @param {Array<import("../types").Column>} mapping 
 * @param {Array<import("../types").Status>} statuses 
 * @returns 
 */
export default function useDataProxy(mapping, statuses) {
    const { theme } = useData();
    const { apiUrl } = theme.value;

    /** @type {import("vue").UnwrapNestedRefs<Array<import("../types").Dataset>>} */
    const datasets = reactive([]);

    /** @type {import("vue").Ref<string | null>} */
    const lastModified = ref(null);

    /** @type {import("vue").Ref<string | null>} */
    const nextCursor = ref(null);

    /**
     * Transform records from API keys to mapped keys
     * @param {Array} records Records from API
     * @returns {Array<import("../types").Dataset>}
     */
    function tranformRecords(records) {
        return records
            .map(record => {
                for (const property in record.properties) {
                    record.properties[property] = getPropertyValue(record.properties[property]);
                }
                return record;
            })
            .map((record) => {
                const row = {};

                mapping.forEach((mapping) => {
                    const property = record.properties[mapping.source];
                    row[mapping.key] = mapping.transform ? mapping.transform(property) : property;
                });

                row.raw = record.properties;
                row.status = statuses.find((status) => status.source.includes(row.status.name));
                row.visible = true;

                return /** @type {import("../types").Dataset} */ (row);
            });
    }

    /**
    * Notion properties are nested in object with a key equals to their type.
    * @param {Record<string, Object>} property
    */
    function getPropertyValue(property) {
        const type = property.type;
        if (property.hasOwnProperty(type)) {
            return property[type];
        } else {
            return property;
        }
    }

    /**
     * Get data from API
     * @param {string | null} [cursor]
     */
    function getData(cursor) {
        axios.get(`${apiUrl}/inventaire`, {params: {start_cursor: cursor}}).then((res) => {
            /** @type {Array} */
            const records = res.data.results;
            datasets.push(...tranformRecords(records));
            nextCursor.value = res.data.next_cursor

            lastModified.value = records
                .map((r) => r.last_edited_time)
                .sort((a, b) => b.localeCompare(a))
                .pop();
        });
    }

    onMounted(() => {
        getData();
    });

    return { datasets, lastModified, nextCursor, getData };

}
