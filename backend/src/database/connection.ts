import {Sequelize} from 'sequelize-typescript'
import 'dotenv/config'
import dotenv from 'dotenv'
dotenv.config({
    path: './src/.env'
})

export const connection = new Sequelize({
    dialect: 'sqlite',
    models: [__dirname + '/../models'],
    storage: '././../db/timetracker'
})