/** @typedef {{id: string, type: string, }} Property */
/** @typedef {{label?: string, format?: (cell: object | string, row: Row) => string, transform?: (cell: Array | Object) => string, width?: string}} ColumnConfiguration */
/** @typedef {{key: string} & ColumnConfiguration} Column */
/** 
 * @typedef {"todefine" | "opening" | "open" | "open-on-site" | "notopen" } StatusKey
 * @typedef {{label: string, key: StatusKey, _class: string}} Status
*/
/** @typedef {{id: string, TYPE: string, CATEGORIE: string, TITLE: string, LIEN: string, PRODUCTEUR: string, status: Status, "DATE ESTIMÉE": string | null, "MINISTÈRE DE TUTELLE": string}} Row */
/** @typedef {{ label: string | null, key: string | null }} Option */
/** @typedef {"organization" | "status" | "category" | "supervisor" | "type"} Filters */
/** @typedef {Map<Filters, string>} FiltersMap */

export default {};
