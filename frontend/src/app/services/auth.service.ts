import {HttpClient} from '@angular/common/http'
import {computed, inject, Injectable, signal} from '@angular/core'
import {Router} from '@angular/router'
import {environment} from '../../environments/environment.development'
import {Session} from '../interface/api-interface'
import {share} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = `${environment.API_URL}/api/auth`

  private http = inject(HttpClient)
  public router = inject(Router)
  token?: string | null = null
  auth: boolean = false
  currentUser = signal<Session | null | undefined> (undefined)

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, {name, email: email, password})
  }

  logout() {
    if (typeof window !== 'undefined') {
      this.token = null
      sessionStorage.removeItem('jwt')
      sessionStorage.removeItem('userId')
      this.router.navigate(['/login'])
    }
  }

  login(email: string, password: string) {
    return this.http.post<Session>(`${this.apiUrl}/login`, {email: email, password}).pipe(share())

  }

  refreshToken(refreshToken: string) {
    return this.http.post<Session>(`${this.apiUrl}/refresh`, {refreshToken: refreshToken})
  }

  validateToken(token: string) {
    return this.http.post(`${this.apiUrl}/auth/validateToken`, {token: token})
  }

  saveToken(token: string) {
    this.token = token
    sessionStorage.setItem('jwt', token)
  }

  saveUser(user: Session) {
    sessionStorage.setItem('user', JSON.stringify(user))
  }

  loadToken() {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('jwt')
      if (token) this.token = token
      return this.token
    }
    return null
  }

  isAuthenticated() {
    if (typeof window !== 'undefined') {
      const token = this.loadToken()
      if (!token || this.currentUser() === null) return false
      return (token === this.currentUser()?.accessToken)
    }
    return false
  }
}
