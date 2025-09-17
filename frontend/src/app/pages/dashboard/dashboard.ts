import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core'
import {Time} from '../../interface/api-interface'
import {TimeService} from '../../services/time.service'
import {AuthService} from '../../services/auth.service'
import {TableModule} from 'primeng/table'

@Component({
  selector: 'app-dashboard',
  imports: [
    TableModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit{

  private timeService = inject(TimeService)
  private authService = inject(AuthService)
  private cdref = inject(ChangeDetectorRef)

  times: Time[] | null = null

  ngOnInit() {
    this.getTime()
  }

  getTime(){
    const user = this.authService.currentUser()
    if (!user) return
    this.timeService.getTimeUserId(user?.user.userId).subscribe({
      next: (res) => {
        console.log(res)
        this.cdref.markForCheck()
        this.times = res
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

}
