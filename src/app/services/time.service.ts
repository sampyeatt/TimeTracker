import {Injectable} from '@angular/core'
import {Time} from '../interface/api-interface'
import Database from '@tauri-apps/plugin-sql'

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

    async getActiveTimes(userId: number) {
        if (this.db) {
            return await this.db.select<Time[]>(`SELECT *
                                                 FROM times
                                                 WHERE userId = $1 AND running = 1`, [userId])
        }
        return []
    }

    async newTime(userId: number, clientName: string, key: string) {
        if (this.db) {
            return await this.db.execute('INSERT INTO times (client_name, key, userId, total_time) VALUES ($1, $2, $3, $4)', [clientName, key, userId, 0])
        }
        return null
    }

    async startTime(id: number, running: number) {
        if (this.db) {
            const date = Date.now()
            return await this.db.execute('UPDATE times SET current_time = $1, running = $2 WHERE id = $3', [date, running, id])
        }
        return null
    }

    async stopTime(userId: number, totalTime: number = 0, currentTime: number = 0, timeId: number) {
        if (this.db) {
            const date = Date.now()
            await this.db.execute(`UPDATE times SET running = 0, total_time =  $1 + ($2 - $3) WHERE userId = $4 AND id = $5`, [totalTime, date, currentTime, userId, timeId])
        }
    }

    async resetAllTime(userId: number) {
        if (this.db) {
            await this.db.execute('UPDATE times SET running = 0, current_time = 0, total_time = 0 WHERE userId = $1', [userId])
        }
    }

    async deleteTime(id: number) {
        if (this.db) {
            await this.db.execute('DELETE FROM times WHERE id = $1', [id])
        }
    }
}
