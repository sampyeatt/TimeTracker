import { Injectable } from '@angular/core'
import { Time } from '../interface/api-interface'
import Database from '@tauri-apps/plugin-sql'

/**
 * Intectable service to handle time related database operations
 * @author
 */
@Injectable({
    providedIn: 'root'
})
export class TimeService {
    private db: Database | null = null

    /**
     * Constructor to initialize database connection
     */
    constructor() {
        this.initDB()
    }

    /**
     * Initialize database connection
     */
    private async initDB() {
        this.db = await Database.load('sqlite:test.db')
    }

    /**
     * Get all times from database for a given user
     * @param userId - user id number
     * @returns Time[] - array of time data
     */
    async getTimeUserId(userId: number) {
        if (this.db) {
            return await this.db.select<Time[]>(
                `SELECT *
                                                 FROM times
                                                 WHERE userId = $1`,
                [userId]
            )
        }
        return []
    }

    /**
     * Get time data for a given time id
     * @param id - time id number
     * @returns Time - time data
     */
    async getTimeTimeId(id: number) {
        if (this.db) {
            const time = await this.db.select<Time[]>(
                `SELECT *
                                                 FROM times
                                                 WHERE id = $1`,
                [id]
            )
            return time[0]
        }
        return null
    }

    /**
     * Return all active times for a given user. An active time is a time that is currently running.
     * @param userId - user id number
     * @returns Time[] - array of active times
     */
    async getActiveTimes(userId: number) {
        if (this.db) {
            return await this.db.select<Time[]>(
                `SELECT *
                                                 FROM times
                                                 WHERE userId = $1 AND running = 1`,
                [userId]
            )
        }
        return []
    }

    /**
     * Create a new time entry in the database
     * @param userId - user id number
     * @param clientName - name of the client
     * @param key - key pressed to start the time entry
     * @returns QueryResult - result of the insert operation
     */
    async newTime(userId: number, clientName: string, key: string) {
        if (this.db) {
            return await this.db.execute(
                'INSERT INTO times (client_name, key, userId, total_time) VALUES ($1, $2, $3, $4)',
                [clientName, key, userId, 0]
            )
        }
        return null
    }

    /**
     * Start a time entry for a given time id. This will set the current time to the current time and set the running flag to 1.
     * @param id - time id number
     * @param running - running flag. 1 for running, 0 for stopped
     * @returns QueryResult - result of the update operation
     */
    async startTime(id: number, running: number) {
        if (this.db) {
            const date = Date.now()
            return await this.db.execute('UPDATE times SET current_time = $1, running = $2 WHERE id = $3', [
                date,
                running,
                id
            ])
        }
        return null
    }

    /**
     * Stop a time entry for a given time id. This will set the current time to the current time and add the difference between the current time and the start time to the total time.
     * @param userId - user id number
     * @param totalTime - total time spent on current project.
     * @param currentTime - current time in milliseconds.
     * @param timeId - time id number
     */
    async stopTime(userId: number, totalTime: number = 0, currentTime: number = 0, timeId: number) {
        if (this.db) {
            const date = Date.now()
            await this.db.execute(
                `UPDATE times SET running = 0, total_time =  $1 + ($2 - $3) WHERE userId = $4 AND id = $5`,
                [totalTime, date, currentTime, userId, timeId]
            )
        }
    }

    /**
     * Reset all times for a given user. This will set the running flag to 0, the current time to 0 and the total time to 0.
     * @param userId - user id number
     */
    async resetAllTime(userId: number) {
        if (this.db) {
            await this.db.execute('UPDATE times SET running = 0, current_time = 0, total_time = 0 WHERE userId = $1', [
                userId
            ])
        }
    }

    /**
     * Delete a time entry for a given time id
     * @param id - time id number
     */
    async deleteTime(id: number) {
        if (this.db) {
            await this.db.execute('DELETE FROM times WHERE id = $1', [id])
        }
    }
}
