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

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, {name, email: email, password})
  }

  getUser() {
    return this.http.get<Session>(`${environment.API_URL}/api/user/user`)
  }

  saveUser(user: Session) {
    sessionStorage.setItem('user', JSON.stringify(user))
  }

  setCurrentUser() {
    const user = this.getUser().pipe()
    console.log('Fetching user from server.', user)
    if (user) {
      user.subscribe({
        next: (res) => {
          this.currentUser.set(res)
          return true
        },
        error: (err) => {
          console.error('Failed to get user.', err)
          return false
        }
      })
      return true
    } else {
      return false
    }
  }

  isAuthenticated() {
    console.log('Checking authentication.', this.currentUser())
    if (typeof window === 'undefined') {
      if (!this.currentUser()) {
        console.log('User is not authenticated. Fetching user from server.')
        return this.setCurrentUser()
      }
      return (!!this.currentUser())
    }
    return (!!this.currentUser())
  }
}
