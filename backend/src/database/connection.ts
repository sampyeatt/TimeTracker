import {Sequelize} from 'sequelize-typescript'

export const connection = new Sequelize({
    dialect: 'sqlite',
    storage: './time.db',
    models: [__dirname + '/../models']
})