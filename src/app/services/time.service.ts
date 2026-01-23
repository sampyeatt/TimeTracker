import {Injectable} from '@angular/core'
import {Time} from '../interface/api-interface'
import Database, {QueryResult} from '@tauri-apps/plugin-sql'

@Injectable({
    providedIn: 'root'
})
export class TimeService {
    private db: Database | null = null

    constructor() {
        this.initDB()
    }

    private async initDB() {
        this.db = await Database.load('sqlite:test.db')
    }

    async getTimeUserId(userId: number) {
        console.log('get time user id', userId)
        if (this.db) {
            return await this.db.select<Time[]>(`SELECT *
                                                 FROM times
                                                 WHERE userId = $1`, [userId])
        }
        return []
    }

    async getTimeTimeId(id: number) {
        if (this.db) {
            const time = await this.db.select<Time[]>(`SELECT *
                                                 FROM times
                                                 WHERE id = $1`, [id])
            return time[0]
        }
        return null
    }

    async newTime(userId: number, clientName: string, key: string) {
        if (this.db) {
            return await this.db.execute('INSERT INTO times (client_name, key, userId, total_time) VALUES ($1, $2, $3, $4)', [clientName, key, userId, 0])
        }
        return null
    }

    async startTime(id: number, running: number) {
        console.log('start time', id, running)
        if (this.db) {
            const date = Date.now()
            console.log('start time date', date)
            return await this.db.execute('UPDATE times SET current_time = $1, running = $2 WHERE id = $3', [date, running, id])
        }
        return null
    }

    async stopTime(userId: number) {
        if (this.db) {
            const date = Date.now()
            console.log('stop time', date)
            await this.db.execute(`UPDATE times SET running = 0, total_time =  total_time + (${date} - current_time) WHERE userId = ? AND running = 1`, [userId])
        }
    }

    async resetAllTime(userId: number) {
        if (this.db) {
            this.db.execute('UPDATE times SET running = 0, current_time = 0, total_time = 0 WHERE userId = $1', [userId])
        }
    }

    async deleteTime(id: number) {
        if (this.db) {
            await this.db.execute('DELETE FROM times WHERE id = $1', [id])
        }
    }
}
