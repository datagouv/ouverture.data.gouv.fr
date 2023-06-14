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

    /** @type {import("vue").UnwrapNestedRefs<Array<import("../types").Row>>} */
    const rows = reactive([]);

    /** @type {import("vue").Ref<string | null>} */
    const lastModified = ref(null);

    /** @type {import("vue").Ref<string | null>} */
    const nextCursor = ref(null);

    const hasError = ref(false);

    /**
     * Transform records from API keys to mapped keys
     * @param {Array} records Records from API
     * @returns {Array<import("../types").Row>}
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
                console.log(record);
                const row = {};

                mapping.forEach((mapping) => {
                    row[mapping.key] = record.properties[mapping.key];
                });

                row.status = statuses.find((status) => status.label === row["STATUT D'OUVERTURE"]);
                console.log(row);
                return /** @type {import("../types").Row} */ (row);
            });
    }

    /**
    * Notion properties are objects with a key equals to their type 
    * but they are nested for some types.
    * @param {Record<string, Object> | string} property
    */
    function getPropertyValue(property) {
        if (!property) {
            return property;
        }
        if (typeof property === "string") {
            return property.trim();
        }
        const type = property.type;
        if (property.hasOwnProperty(type)) {
            if(type === "title") {
                return property[type][0].plain_text;
            }
            return getPropertyValue(property[type]);
        } else if(property.hasOwnProperty("name")) {
            return property.name.trim();
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
            rows.push(...tranformRecords(records));
            nextCursor.value = res.data.next_cursor
            hasError.value = false;
            lastModified.value = records
                .map((r) => r.last_edited_time)
                .sort((a, b) => b.localeCompare(a))
                .pop();
        }).catch(e => {
            hasError.value = true;
        });
    }

    onMounted(() => {
        getData();
    });

    return { hasError, rows, lastModified, nextCursor, getData };

}
