import { connection } from "./connection"

connection.sync({
    logging: false,
    alter: true,
    force: true,
})

export { connection }