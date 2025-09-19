import {CanActivateFn, Router} from '@angular/router'
import {inject, Injectable} from '@angular/core'
import {AuthService} from '../services/auth.service'

Injectable({
  providedIn: 'root'
})

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)

  if (auth.isAuthenticated()) {
    return true
  } else {
    const user = auth.currentUser()
    if (user) {
      auth.refreshToken(user.refreshToken).subscribe({
        next: (res) => {
          auth.saveToken(res.accessToken)
          auth.saveUser(res)
          return true
        },
        error: (err) => {
          console.log(err)
        }
      })
    }
    router.navigate(['/login'])
    return false
  }
}


