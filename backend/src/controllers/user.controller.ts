import {Request, Response} from 'express'
import {getAllUsers, addUser} from '../services/user.service'
import z from 'zod'

export const getUsers = async (req: Request, res: Response) => {
    const users = await getAllUsers()

    res.json(users)
}

export const addUserController = async (req: Request, res: Response) => {
    const schema = z.object({
        name: z.string().min(1),
        email: z.email()
    })
    const schemaValidation = schema.safeParse(req.body)
    if (!schemaValidation.success) return res.status(400).json({'message': 'Invalid request body', 'errors': schemaValidation.error.issues})
    const {name, email} = req.body
    res.json(await addUser(name, email))
}
