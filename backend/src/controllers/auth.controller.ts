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