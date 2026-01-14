import {connection} from './connection'

connection.sync()
connection.options.logging = false

export {connection}