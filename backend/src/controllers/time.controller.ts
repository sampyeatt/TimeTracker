import {Request, Response} from 'express'
import {
    addNewTime,
    deleteTime,
    getRunningTime,
    getTimeByTimeId,
    getTimeByUserId,
    updateTime
} from '../services/time.service'
import z from 'zod'
import {Time} from '../models/Time'

export const getTimeByUserIdController = async (req: Request, res: Response) => {
    const schema = z.string().min(1)
    const schemaValidation = schema.safeParse(req.params.userId)
    if (!schemaValidation.success) return res.status(400).json({message: 'Missing/invalid user ID'})
    const userId = req.params.userId
    if (!userId) return res.status(400).send('User ID is required')
    res.json(await getTimeByUserId(+userId))
}

export const getTimeByTimeIdController = async (req: Request, res: Response) => {
    const schema = z.string().min(1)
    const schemaValidation = schema.safeParse(req.params.timeId)
    if (!schemaValidation.success) return res.status(400).json({message: 'Missing/invalid time ID'})
    const timeId = req.params.timeId
    if (!timeId) return res.status(400).send('Time ID is required')
    res.json(await getTimeByTimeId(+timeId))
}

export const addNewTimeController = async (req: Request, res: Response) => {
    const schema = z.object({
        client_name: z.string().min(1),
        key: z.string().min(1),
        userId: z.number().min(1)
    })
    const schemaValidation = schema.safeParse(req.body)
    if (!schemaValidation.success) return res.status(400).json({
        message: 'Invalid request body',
        errors: schemaValidation.error.issues
    })
    const data = req.body
    console.log('Data: ', data)
    res.json(await addNewTime(data))
}

export const updateTimeController = async (req: Request, res: Response) => {
    const schema = z.object({
        id: z.number(),
        userId: z.number()
    })
    const schemaValidation = schema.safeParse(req.body)
    if (!schemaValidation.success) return res.status(400).json({
        message: 'Invalid request body',
        errors: schemaValidation.error.issues
    })
    const {id, userId} = req.body

    const timeData = await getTimeByTimeId(id)
    if (!timeData) return res.status(400).json({message: 'Time not found'})
    let time = timeData[0]
    if (!time) return res.status(400).json({message: 'Time not found'})
    if (time.userId !== userId) return res.status(403).json({message: 'You are not authorized to update this time'})
    time = time.toJSON()
    if (!time.running) { // START TIME
        time.current_time = Date.now()
        time.running = 1
        const updated = await updateTime(time)
        if (!updated) return res.status(400).json({message: 'Time not updated', errors: updated})
        res.json({message: 'Time started', time: updated})
    } else if (time.running) { // STOP TIME
        time.total_time += (Date.now() - time.current_time)
        time.running = 0
        time.current_time = 0
        const updated = await updateTime(time)
        if (!updated) return res.status(400).json({message: 'Time not updated', errors: updated})
        res.json({message: 'Time stopped', time: updated})
    } else {
        res.json({message: `Something went wrong... very wrong. running = ${time.running} for id = ${id} and client_name = ${time.client_name}`})
    }
}

export const deleteTimeController = async (req: Request, res: Response) => {
    const schema = z.string().min(1)
    const schemaValidation = schema.safeParse(req.params.timeId)
    if (!schemaValidation.success) return res.status(400).json({message: 'Missing/invalid time ID'})
    const timeId = req.params.timeId
    if (!timeId) return res.status(400).send('Time ID is required')
    await  deleteTime(+timeId)
    res.json({message: 'Time deleted'})
}

export const stopAllTimeController = async (req: Request, res: Response) => {
    const schema = z.object({
        userId: z.number()
    })
    const schemaValidation = schema.safeParse(req.body)
    if (!schemaValidation.success) return res.status(400).json({
        message: 'Invalid request body',
        errors: schemaValidation.error.issues
    })
    const {userId} = req.body
    const times = (await getRunningTime(userId)).map(time => time.toJSON())
    times.forEach(async (time) => {
        time.total_time += (Date.now() - time.current_time)
        time.running = 0
        time.current_time = 0
        await updateTime(time)
    })
    const allTimes = await getTimeByUserId(userId)
    res.json({message: 'All times stopped', times: allTimes})
}

export const resetAllTimeController = async (req: Request, res: Response) => {
    const schema = z.object({
        userId: z.number()
    })
    const schemaValidation = schema.safeParse(req.body)
    if (!schemaValidation.success) return res.status(400).json({
        message: 'Invalid request body',
        errors: schemaValidation.error.issues
    })
    console.log('req.body: ', req.body)
    const {userId} = req.body
    const times = (await getTimeByUserId(userId)).map(time => time.toJSON())
    console.log('times', times)
    let updatedTimes: Time[] = []
    times.forEach(async (time) => {
        time.total_time = 0
        time.running = 0
        time.current_time = 0
        const updated = await updateTime(time)
        if (!updated) return res.status(400).json({message: 'Time not updated', errors: updated})
        updatedTimes.push(updated.toJSON())
    })
    console.log('updatedTimes', updatedTimes)
    res.json({message: 'All times reset', times: updatedTimes})
}