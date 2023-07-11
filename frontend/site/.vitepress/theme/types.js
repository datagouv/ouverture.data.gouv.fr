/** @typedef {{id: string, type: string, }} Property */
/** @typedef {{label?: string, format?: (cell: object | string, row: Row) => string, transform?: (cell: Array | Object) => string, width?: string}} ColumnConfiguration */
/** @typedef {{key: string} & ColumnConfiguration} Column */
/** 
 * @typedef {"todefine" | "opening" | "open" | "notopen" } StatusKey
 * @typedef {{label: string, key: StatusKey, _class: string}} Status
*/
/** @typedef {{TYPE: string, CATEGORIE: string, TITLE: string, LIEN: string, PRODUCTEUR: string, status: Status, "DATE ESTIMÉE": string | null, "MINISTÈRE DE TUTELLE": string}} Row */
/** @typedef {{ label: string | null, key: string | null }} Option */
/** @typedef {{organization: string, status: string, category: string, supervisor: string, type: string}} Filters */

export default {};