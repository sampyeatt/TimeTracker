import { Component, inject, OnInit } from '@angular/core'
import { RouterOutlet, Router } from '@angular/router'
import { NavBarComponent } from './component/nav-bar/nav-bar'
import { AuthService } from './services/auth.service'
import { setTheme } from '@tauri-apps/api/app'

/**
 * Main application component
 */
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavBarComponent],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App implements OnInit {
    private authSercices = inject(AuthService)
    private router = inject(Router)

    /**
     * Constructor to Set theme to dark
     */
    constructor() {
        // setTheme('dark')
    }

    /**
     * oninit to check if user is authenticated and redirect to dashboard if so
     */
    ngOnInit() {
        console.log('App initialized')

        if (this.authSercices.currentUser() === undefined) {
            this.authSercices.setCurrentUser().then((auth) => {
                if (auth) this.router.navigate(['/dashboard'])
                else this.router.navigate(['/register'])
            })
        }
    }
}
