/** @typedef {{id: string, type: string, }} Property */
/** @typedef {{label: string, format?: (cell: object | string, row: Row) => string, transform?: (cell: Array | Object) => string, width?: string}} ColumnConfiguration */
/** @typedef {{key: string} & ColumnConfiguration} Column */
/** 
 * @typedef {"closed" | "opening" | "preview" | "open" | "notopen" } StatusKey
 * @typedef {{label: string, key: StatusKey, _class: string}} Status
*/
/** @typedef {{type: string, title: string, url: string, organization: string, status: Status, date: string | null}} Row */
/** @typedef {{ label: string | null, key: string | null }} Option */
/** @typedef {{organization: string, status: string, trimester: string, type: string}} Filters */

export default {};