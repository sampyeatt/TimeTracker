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
      this.authService.register(this.form.value.name as string, this.form.value.email as string)
        .subscribe({
          next:()=>{
            alert('Registration successful!');
            this.authService.getUser().subscribe({
              next:(res)=>{
                this.authService.currentUser.set(res)
                this.router.navigate(['/dashboard'])
              },
              error:(err)=>{
                console.error('Failed to get user.', err)
              }
            })
          },
          error: (err)=>{
            console.error('Registration failed.', err);
            alert('Registration failed: '+(err.error?.message || "Unknown error"))
          }
        });
    }
  }
}
