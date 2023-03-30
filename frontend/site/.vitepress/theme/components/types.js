/** @typedef {{label: string, source: string, format?: Function, width?: string}} ColumnConfiguration */
/** @typedef {{key: string} & ColumnConfiguration} Column */
/** 
 * @typedef {"closed" | "opening" | "preview" | "open" | "notopen" } StatusKey
 * @typedef {{label: string, key: StatusKey, visible: boolean, _class: string, labelExtended: string}} Status
*/
/** @typedef {{type: string, title: string, organization: string, status: Status, date: string}} Dataset */
/** @typedef {{ label: string, key: string }} Option */
/** @typedef {{organization: string, status: string, trimester: string, type: string}} Filters */

export default {};