import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    Default
} from 'sequelize-typescript'

@Table
export class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        allowNull: false,
        unique: true
    })
    declare userId: number

    @Column({
        allowNull: false
    })
    declare name: string

    @Column({
        unique: true,
        allowNull: false
    })
    declare email: string
}