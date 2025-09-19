import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core'
import {Time} from '../../interface/api-interface'
import {TimeService} from '../../services/time.service'
import {AuthService} from '../../services/auth.service'
import {TableModule} from 'primeng/table'
import {ButtonModule} from 'primeng/button'
import {CommonModule} from '@angular/common'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {RippleModule} from 'primeng/ripple'
import {DialogModule} from 'primeng/dialog'
import {FloatLabelModule} from 'primeng/floatlabel'
import {InputTextModule} from 'primeng/inputtext'
import {DataViewModule} from 'primeng/dataview'

@Component({
  selector: 'app-dashboard',
  imports: [
    TableModule,
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    RippleModule,
    DialogModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    DataViewModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit{

  private timeService = inject(TimeService)
  private authService = inject(AuthService)
  private cdref = inject(ChangeDetectorRef)
  protected readonly Math = Math

  times: Time[] = []
  visible: boolean = false
  endDayDialog: boolean = false
  clientName: string = ''
  key: string = ''

  ngOnInit() {
    this.getTime()
  }

  getTime(){
    const user = this.authService.currentUser()
    if (!user) return
    this.timeService.getTimeUserId(user?.user.userId).subscribe({
      next: (res) => {
        console.log(res)
        this.times = res
        this.cdref.detectChanges()
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  startTime(timeId: number){
    const user = this.authService.currentUser()
    if (!user) return
    const runningTime = this.times.findIndex(time => time.running === 1)
    if (runningTime !== -1) {
      this.timeService.updateTime(this.times[runningTime].id, user?.user.userId).subscribe({
        next: (res) => {
          console.log(res)
          this.times[runningTime] = res.time
          this.cdref.markForCheck()
        },
        error: (err) => {
          console.error(err)
        }
      })
    }
    this.timeService.updateTime(timeId, user?.user.userId).subscribe({
      next: (res) => {
        this.times[this.times.findIndex(time => time.id === timeId)].running = 1
        this.cdref.markForCheck()
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  stopTime(timeId: number){
    const user = this.authService.currentUser()
    if (!user) return
    this.timeService.updateTime(timeId, user?.user.userId).subscribe({
      next: (res) => {
        this.times[this.times.findIndex(time => time.id === timeId)] = res.time
        this.cdref.markForCheck()
      },
      error: (err) => {
        console.error(err)
      }
    })
    this.getTime()
  }

  showDialog() {
    this.visible = true
  }

  newTime(){
    const user = this.authService.currentUser()
    if (!user) return
    console.log(this.clientName + ' ' + this.key)
    this.timeService.newTime(user.user.userId, this.clientName, this.key).subscribe({
      next: (res) => {
        this.times.push(res)
        this.clientName = ''
        this.key = ''
        this.cdref.markForCheck()
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  endDay() {
    const user = this.authService.currentUser()
    if (!user) return
    this.timeService.stopAllTime(user.user.userId).subscribe({
      next: (res) => {
        this.times = res.times
        this.endDayDialog = true
        this.cdref.markForCheck()
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  resetTimes() {
    const user = this.authService.currentUser()
    if (!user) return
    this.timeService.resetAllTime(user.user.userId).subscribe({
      next: (res) => {
        console.log(res)
        this.times = res.times
        this.endDayDialog = false
        this.cdref.markForCheck()
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
}
