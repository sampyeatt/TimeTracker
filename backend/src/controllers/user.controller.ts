import {Request, Response} from 'express'
import {getAllUsers, addUser, getUser} from '../services/user.service'
import z from 'zod'

export const getAllUsersController = async (req: Request, res: Response) => {
    res.json(await getAllUsers())
}

export const getUserController = async (req: Request, res: Response)=> {
    const user = await getUser()
    const session = {
        user: user
    }
    res.json(session)
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
