import {HttpClient} from '@angular/common/http'
import {inject, Injectable, signal} from '@angular/core'
import {Router} from '@angular/router'
import {environment} from '../../environments/environment.development'
import {Session} from '../interface/api-interface'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = `${environment.API_URL}/api/auth`

  private http = inject(HttpClient)
  public router = inject(Router)
  auth: boolean = false
  currentUser = signal<Session | null | undefined> (undefined)

  register(name: string, email: string) {
    return this.http.post(`${this.apiUrl}/register`, {name, email: email})
  }

  getUser() {
    return this.http.get<Session>(`${environment.API_URL}/api/user/user`)
  }

  setCurrentUser() {
    return this.getUser().subscribe({
        next: (res) => {
          if (res.user) {
            this.currentUser.set(res)
            this.auth = true
            return true
          } else return false
        },
        error: (err) => {
          console.error('Failed to get user.', err)
          return false
        }
      }).closed
  }
}
