import {Request, Response} from 'express'
import z from 'zod'
import {addUser, getAllById, getUserByEmail} from '../services/user.service'


export const registerController = async (req: Request, res: Response) => {
    const schema = z.object({
        name: z.string().min(1),
        email: z.email()
    })

    const parsedData = schema.safeParse(req.body)

    if (!parsedData.success) return res.status(400).json({
        message: 'Invalid request body',
        errors: JSON.parse(parsedData.error.message)
    })

    let {name, email} = req.body

    const existingUser = await getUserByEmail(email)
    if (existingUser) return res.status(400).json({message: 'User already exists'})

    const user = await addUser(name, email)
    if (!user) return res.status(500).json({message: 'Internal server error when registering user'})
    return res.status(201).json({message: 'User registered successfully'})

}

export const getUserRoleController = async (req: Request, res: Response) => {
    if (!req.params.userId) return res.status(400).json({message: 'UserId parameter is required'})
    const {userId} = req.params
    const user = await getAllById(+userId)
    if (!user) return res.status(404).json({message: 'User not found'})
    const role = user.get('role')
    return res.status(200).json({role})
}