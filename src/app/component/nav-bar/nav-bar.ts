import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { AuthService } from '../../services/auth.service'
import { RouterModule } from '@angular/router'
import { ButtonModule } from 'primeng/button'

/**
 * Nav bar component.
 */
@Component({
    selector: 'app-nav-bar',
    imports: [CommonModule, RouterModule, ButtonModule],
    templateUrl: './nav-bar.html',
    styleUrl: './nav-bar.css'
})
export class NavBarComponent {
    public authService = inject(AuthService)

    todaysDate = new Date().toLocaleDateString().split('T')[0]

    /**
     * Getter to check if user is authenticated.
     * @returns boolean - true if user is authenticated, false otherwise
     */
    get authenticated() {
        return !!this.authService.currentUser()
    }
}
