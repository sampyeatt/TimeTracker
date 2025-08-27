import {AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table, BelongsTo} from 'sequelize-typescript'
import {User} from './User'

@Table
export class Time extends Model<Time> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        allowNull: false,
        unique: true
    })
    declare id: number

    @Column({
        allowNull: false
    })
    declare client_name: string

    @Column({
        allowNull: false
    })
    declare key: string

    @Column
    declare total_time: number

    @Column
    declare current_time: number

    @Column({
        allowNull: false,
        defaultValue: 0
    })
    declare running: number

    @ForeignKey(() => User)
    @Column({
        allowNull: false
    })
    declare userId: number

    @BelongsTo(() => User)
    user?: User
}