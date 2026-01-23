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
    keyDisp: string = ''
    invalidKey: boolean = false
    endOfDayTimes: Time[] = []
    endOfDayTimesTotal: number = 0

    ngOnInit() {
        console.log('Dashboard initialized')
        this.getTime()
        this.cdref.markForCheck()
    }

    getTime() {
        let user = this.authService.currentUser()
        console.log('Get Time User', user)
        if (!user) {
            this.authService.setCurrentUser().then(auth => {
                if (auth) {
                    let user = this.authService.currentUser()
                    if (!user) return
                    this.timeService.getTimeUserId(user.userId).then(res => {
                        this.times.set(res)
                        this.cdref.markForCheck()
                    })
                }
            })
        } else {
            this.timeService.getTimeUserId(user.userId).then(res => {
                console.log('Get Time Result', res)
                this.times.set(res)
                this.cdref.markForCheck()
            })
        }
    }

    startTime(timeId: number) {
        const user = this.authService.currentUser()
        if (!user) return
        const runningTimeIndex = this.times().findIndex(time => time.running === 1)
        if (runningTimeIndex !== -1) {
            // Stop currently running time
            this.timeService.stopTime(user.userId).then(res => {
                console.log('Update Running Time Result', res)
                this.timeService.getTimeTimeId(timeId).then(res => {
                    if (res) {
                        this.times()[runningTimeIndex] = res
                        this.cdref.markForCheck()
                    }
                })
            })
        }
        //Start time
        this.timeService.startTime(timeId, 1).then(res => {
            if (res) this.getTime()
        })
    }

    stopTime() {
        const user = this.authService.currentUser()
        if (!user) return
        this.timeService.stopTime(user?.userId).then(res => {
            this.getTime()
        })
    }

    showDialog() {
        this.visible = true
    }

    newTime() {
        const user = this.authService.currentUser()
        console.log('netime user', user)
        if (!user) return
        console.log(this.clientName + ' ' + this.key)
        this.timeService.newTime(user.userId, this.clientName, this.key).then(res => {
            console.log('New Time Result', res)
            if (res && res.lastInsertId) {
                this.timeService.getTimeTimeId(res.lastInsertId).then(res => {
                    if (res) {
                        this.times().push(res)
                        this.clientName = ''
                        this.key = ''
                        this.keyDisp = ''
                        this.cdref.markForCheck()
                    }
                })
            }
        })
    }

    getKeyboardInput(event: KeyboardEvent) {
        const keyArray = this.times().map(time => time.key)
        if (event instanceof KeyboardEvent && keyArray.includes(event.code)) {
            this.invalidKey = true
            this.cdref.markForCheck()
            return
        } else {
            this.invalidKey = false
            this.key = event.code
            this.cdref.markForCheck()
        }
    }

    endDay() {
        const user = this.authService.currentUser()
        if (!user) return
        this.timeService.stopTime(user.userId).then(res => {
                this.getTime()
                this.endOfDayTimes = this.times().filter(time => (time.total_time - 300000) > 0)
                this.endOfDayTimesTotal = this.endOfDayTimes.map(value => {
                    return (Math.ceil(((value.total_time - 300000) / (1000 * 60 * 60)) * 2) / 2).toFixed(2)
                }).reduce((a, b) => parseFloat(a.toString()) + parseFloat(b.toString()), 0)
                console.log(this.endOfDayTimesTotal)
                this.endDayDialog = true
                this.cdref.markForCheck()
        })
    }

    resetTimes() {
        const user = this.authService.currentUser()
        if (!user) return
        this.timeService.resetAllTime(user.userId).then(res => {
                this.getTime()
                this.endDayDialog = false
                this.cdref.markForCheck()
        })
    }

    deleteTimes(time: Time) {
        this.timeService.deleteTime(time.id).then(res =>{
            this.getTime()
        })
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (this.deleteDialog || this.endDayDialog || this.visible) return
        const keyArray = this.times().map(time => time.key)
        if (event instanceof KeyboardEvent && keyArray.includes(event.code)) {
            const time = this.times().find(time => time.key === event.code)
            if (!time) return
            if (time.running === 1) this.stopTime()
            else this.startTime(time.id)
        }
    }
}
