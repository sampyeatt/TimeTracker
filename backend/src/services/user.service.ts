import {User} from '../models/User'


export async function getAllUsers() {
    return await User.findAll()
}

export async function getAllById(userId: number) {
    return await User.findByPk(userId)
}

export async function addUser(name: string, email: string) {
    const user = new User()
    user.set({
        name: name,
        email: email
    })
    return await user.save()

}

export async function getUserByEmail(email: string) {
    return await User.findOne({
        where: {
            email: email
        }
    })
}

export const updateUser = async ({name, id}: {
    name?: string,
    id: number
}) => {
    const user = await User.findByPk(id)
    if (!user) throw new Error('User not found')

    user.set({userId: id})
    if (name) user.set({name: name})
    return await user.save()
}