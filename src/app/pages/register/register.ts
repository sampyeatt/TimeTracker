import { Component, inject } from '@angular/core'
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Button } from 'primeng/button'

/**
 * Register page component
 */
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, Button],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class RegisterComponent {
    private authService = inject(AuthService)
    public router = inject(Router)
    fb = inject(FormBuilder)

    form = this.fb.group({
        name: ['', [Validators.required]]
    })

    /**
     * Submit form data to register a new user.
     */
    onSubmit() {
        if (this.form.valid) {
            this.authService.register(this.form.value.name as string).then((r) => {
                this.authService.setCurrentUser().then((auth) => {
                    if (auth) this.router.navigate(['/dashboard'])
                })
            })
        }
    }
}
