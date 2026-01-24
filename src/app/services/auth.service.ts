import { Injectable, signal } from '@angular/core'
import { Session, User } from '../interface/api-interface'
import Database from '@tauri-apps/plugin-sql'

/**
 *
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    auth: boolean = false
    currentUser = signal<Session | null | undefined>(undefined)

    /**
     * Constructor to initialize database connection
     * @returns
     */
    private async initDB() {
        return await Database.load('sqlite:test.db')
    }

    /**
     * Register a new user in the database. This will create a new user entry in the database.
     * @param name - name of the user
     * @param email - email address of the user
     */
    async register(name: string, email: string) {
        const db = await this.initDB()
        await db.execute('INSERT INTO users (name, email) VALUES (?, ?)', [name, email])
    }

    /**
     * Get the current user from the database.
     * @returns User - user data
     */
    async getUser(): Promise<User | null> {
        const db = await this.initDB()
        const user = await db.select<User[]>('SELECT userId, name, email FROM users')
        return user[0] ?? null
    }

    /**
     * Set the current user signal if a user is found in the database.
     * @returns boolean - true if user is found, false otherwise
     */
    async setCurrentUser() {
        const user = await this.getUser()
        if (user) {
            this.currentUser.set(user)
            this.auth = true
            return true
        } else return false
    }
}
