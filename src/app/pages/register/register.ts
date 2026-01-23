import {Component, inject} from '@angular/core'
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router'
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import {Button} from 'primeng/button'
import {CommonModule} from '@angular/common'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, Button, ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  private authService = inject(AuthService)
  public router = inject(Router)
  fb = inject(FormBuilder)

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  })

  onSubmit(){
    if(this.form.valid){
      console.log('reg attempt', this.form.value)
      this.authService.register(this.form.value.name as string, this.form.value.email as string).then(r =>{
        this.authService.setCurrentUser().then(auth => {
          if (auth) this.router.navigate(['/dashboard'])
        })
      })
    }
  }
}
