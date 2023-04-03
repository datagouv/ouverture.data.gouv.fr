/** @typedef {{id: string, type: string, }} Property */
/** @typedef {{label: string, source: string, format?: (cell: object | string, row: Dataset) => string, transform?: (cell: Array | Object) => string, width?: string}} ColumnConfiguration */
/** @typedef {{key: string} & ColumnConfiguration} Column */
/** 
 * @typedef {"closed" | "opening" | "preview" | "open" | "notopen" } StatusKey
 * @typedef {{label: string, key: StatusKey, visible: boolean, _class: string, source: Array<string>}} Status
*/
/** @typedef {{type: string, title: string, organization: string, status: Status, date: string | null, raw: object, visible: boolean}} Dataset */
/** @typedef {{ label: string | null, key: string | null }} Option */
/** @typedef {{organization: string, status: string, trimester: string, type: string}} Filters */

export default {};