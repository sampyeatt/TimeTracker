import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http'
import {inject} from '@angular/core'
import {AuthService} from '../services/auth.service'
import {BehaviorSubject, catchError, filter, finalize, switchMap, take, throwError} from 'rxjs'

let refreshing: boolean = false
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const token = authService.loadToken()
  if (token) {
    return next(addToken(req, token)).pipe(
      // @ts-ignore
      catchError(error => {
        if (error.status === 401) {
          console.log('Test', error)
          return handle401Error(req, next, authService)
        } else {
          return new Error(error)
        }
      })
    )
  }
  return next(req)
}

const handle401Error = (req: HttpRequest<any>, nexthe: HttpHandlerFn, authService: AuthService) => {
  console.log('Refreshing token', refreshing)
  if (!refreshing) {
    refreshing = true
    const user = authService.currentUser()
    console.log('user', user)
    if (!user) return new Error('User not found')
    return authService.refreshToken(user.refreshToken).pipe(
      switchMap(res => {
        console.log('Token refreshed', res)
        authService.saveToken(res.accessToken)
        authService.saveUser(res)
        const test = nexthe(addToken(req, res.accessToken))
        console.log('test', test)
        return test
      }),
      catchError(err => {
        console.log('Error refreshing token', err)
        refreshing = false
        authService.logout()
        return throwError(() => new Error())
      }),
      finalize(() => {
        refreshing = false
      })
    )
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(accessToken => {
        console.log('refresh subj', accessToken)
        return nexthe(addToken(req, accessToken))
      })
    )
  }
}

const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
}
