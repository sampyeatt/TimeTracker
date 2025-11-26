import {Sequelize} from 'sequelize-typescript'

export const connection = new Sequelize({
    dialect: 'sqlite',
    storage: '../db/time.db',
    models: [__dirname + '/../models']
})