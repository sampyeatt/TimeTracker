import {Sequelize} from 'sequelize-typescript'

export const connection = new Sequelize({
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: '../../db/timetracker.sqlite',
    models: [__dirname + '/../models']
})