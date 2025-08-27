import {Time} from '../models/Time'

export async function getTimeByUserId(userId: number) {
    return await Time.findAll({
        where: {
            userId: userId
        }
    })
}

export async function getTimeByTimeId(timeId: number){
    return await Time.findAll({
        where: {
            id: timeId
        }
    })
}

export async function addNewTime(newTime: { client_name: string, key: string, userId: number}){
    const timeInstance = new Time()
    timeInstance.set(newTime)
    timeInstance.set({running: 0})
    return await timeInstance.save()
}

export async function updateTime(timeData: Partial<Time>){
    const timeInstance = await Time.findByPk(timeData.id)
    if (!timeInstance) return
    timeInstance.set(timeData)
    return await timeInstance.save()

}