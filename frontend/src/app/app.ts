import {Component, inject, OnInit, signal} from '@angular/core'
import {Router, RouterOutlet} from '@angular/router'
import {NavBarComponent} from './component/nav-bar/nav-bar'
import {AuthService} from './services/auth.service'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('TimeTracker')

  private authSercices = inject(AuthService)
  private router = inject(Router)

  ngOnInit() {
    console.log('App initialized')

    if (this.authSercices.currentUser() === undefined) {
      if(this.authSercices.setCurrentUser())
        this.router.navigate(['/dashboard'])
      else this.router.navigate(['/register'])
    }
  }
}
