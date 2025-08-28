import {Sequelize} from 'sequelize-typescript'

export const connection = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory',
    models: [__dirname + '/../models']
})