import {ChangeDetectorRef, Component, HostListener, inject, OnInit, signal} from '@angular/core'
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
export class DashboardComponent implements OnInit {

  private timeService = inject(TimeService)
  private authService = inject(AuthService)
  private cdref = inject(ChangeDetectorRef)
  protected readonly Math = Math

  times = signal<Time[]>([])
  visible: boolean = false
  endDayDialog: boolean = false
  deleteDialog: boolean = false
  clientName: string = ''
  key: string = ''
  invalidKey: boolean = false

  ngOnInit() {
    this.getTime()
    this.cdref.markForCheck()
  }

  getTime() {
    const user = this.authService.currentUser()
    if (!user) return
    this.timeService.getTimeUserId(user?.user.userId).subscribe({
      next: (res) => {
        this.times.set(res)
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  startTime(timeId: number) {
    const user = this.authService.currentUser()
    if (!user) return
    const runningTime = this.times().findIndex(time => time.running === 1)
    if (runningTime !== -1) {
      this.timeService.updateTime(this.times()[runningTime].id, user?.user.userId).subscribe({
        next: (res) => {
          this.times()[runningTime] = res.time
          this.cdref.markForCheck()
        },
        error: (err) => {
          console.error(err)
        }
      })
    }
    this.timeService.updateTime(timeId, user?.user.userId).subscribe({
      next: (res) => {
        this.times()[this.times().findIndex(time => time.id === timeId)].running = 1
        this.cdref.markForCheck()
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  stopTime(timeId: number) {
    const user = this.authService.currentUser()
    if (!user) return
    this.timeService.updateTime(timeId, user?.user.userId).subscribe({
      next: (res) => {
        this.times()[this.times().findIndex(time => time.id === timeId)] = res.time
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

  newTime() {
    const user = this.authService.currentUser()
    if (!user) return
    console.log(this.clientName + ' ' + this.key)
    this.timeService.newTime(user.user.userId, this.clientName, this.key).subscribe({
      next: (res) => {
        this.times().push(res)
        this.clientName = ''
        this.key = ''
        this.cdref.markForCheck()
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  getKeyboardInput(event: KeyboardEvent) {
    console.log('Test')
    const keyArray = this.times().map(time => time.key)
    if (event instanceof KeyboardEvent && keyArray.includes(event.code)) {
      this.invalidKey = true
      this.cdref.markForCheck()
      return
    } else {
      console.log('Good', event.code)
      this.invalidKey = false
      this.key = event.code
      this.cdref.markForCheck()
    }
  }

  endDay() {
    const user = this.authService.currentUser()
    if (!user) return
    this.timeService.stopAllTime(user.user.userId).subscribe({
      next: (res) => {
        this.times.set(res.times)
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
        this.times.set(res.times)
        this.endDayDialog = false
        this.cdref.markForCheck()
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  deleteTimes(time: Time) {
    this.timeService.deleteTime(time.id).subscribe({})
    this.times.update(times => times.filter(t => t.id !== time.id))
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.deleteDialog || this.endDayDialog || this.visible) return
    const keyArray = this.times().map(time => time.key)
    if (event instanceof KeyboardEvent && keyArray.includes(event.code)) {
      const time = this.times().find(time => time.key === event.code)
      if (!time) return
      if (time.running === 1) this.stopTime(time.id)
      else this.startTime(time.id)
    }
  }
}
