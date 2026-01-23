import {Injectable, signal} from '@angular/core'
import {Session, User} from '../interface/api-interface'
import Database from '@tauri-apps/plugin-sql'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    auth: boolean = false
    currentUser = signal<Session | null | undefined>(undefined)

    private async initDB() {
        return await Database.load('sqlite:test.db')
    }

    async register(name: string, email: string) {
        const db = await this.initDB()
        if (db) {
            await db.execute('INSERT INTO users (name, email) VALUES (?, ?)', [
                name,
                email
            ])
        }
    }

    async getUser() {
        const db = await this.initDB()
        if (db) {
            const user = await db.select<User[]>('SELECT userId, name, email FROM users')
            return user[0]
        }
        return null
    }

    async setCurrentUser() {
        const user = await this.getUser()
        if (user) {
            this.currentUser.set(user)
            this.auth = true
            return true
        } else return false
    }
}
