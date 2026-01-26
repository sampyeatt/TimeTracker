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

/**
 * Dashboard page component.
 */
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

    /**
     * On Init get all times for the current user
     */
    ngOnInit() {
        this.getTime()
        this.cdref.markForCheck()
    }

    /**
     * Get all times for the current user. If the user is not authenticated, get the user from the database and set the user in the auth service.
     */
    getTime() {
        const user = this.authService.currentUser()
        if (!user) {
            this.authService.setCurrentUser().then((auth) => {
                if (auth) {
                    const user = this.authService.currentUser()
                    if (!user) return
                    this.timeService.getTimeUserId(user.userId).then((res) => {
                        console.log('data', res)
                        this.times.set(res)
                        this.cdref.markForCheck()
                        return true
                    })
                }
            })
        } else {
            this.timeService.getTimeUserId(user.userId).then((res) => {

                console.log('data', res)
                this.times.set(res)
                this.cdref.markForCheck()
                return true
            })
        }
    }

    /**
     * Start a time entry for a given time id. This will set the running flag to 1 for the time entry.
     * If a time entry is currently running, stop the currently running time entry and set the running flag to 0 for the new time entry.
     * @param timeId - time id number
     */
    startTime(timeId: number) {
        const user = this.authService.currentUser()
        if (!user) return
        const runningTimeIndex = this.times().findIndex((time) => time.running === 1)
        const runningTime = this.times()[runningTimeIndex]
        if (runningTimeIndex !== -1) {
            // Stop currently running time
            this.timeService
                .stopTime(user.userId, runningTime.total_time, runningTime.current_time, runningTime.id)
                .then((res) => {
                    this.timeService.getTimeTimeId(timeId).then((res) => {
                        if (res) {
                            this.times()[runningTimeIndex] = res
                            this.cdref.markForCheck()
                        }
                    })
                })
        }
        //Start time
        this.timeService.startTime(timeId, 1).then((res) => {
            if (res) this.getTime()
        })
    }

    /**
     * Stop a time entry for a given time id. This will set the running flag to 0 for the time entry.
     * If the total time is 0, set the total time to the current time.
     * @param timeId - time id number
     * @param totalTime - total time in milliseconds
     * @param currentTime - current time in milliseconds
     */
    stopTime(timeId: number, totalTime: number = 0, currentTime: number = 0) {
        const user = this.authService.currentUser()
        if (!user) return
        this.timeService.stopTime(user?.userId, totalTime, currentTime, timeId).then((res) => {
            this.getTime()
        })
    }

    /**
     * trigger to show dialog window
     */
    showDialog() {
        this.visible = true
    }

    /**
     * Add a new time entry to the database.
     */
    newTime() {
        const user = this.authService.currentUser()
        if (!user) return
        console.log(this.clientName + ' ' + this.key)
        this.timeService.newTime(user.userId, this.clientName, this.key).then((res) => {
            if (res && res.lastInsertId !== undefined) {
                this.timeService.getTimeTimeId(res.lastInsertId).then((res) => {
                    if (res) {
                        this.times().push(res)
                        this.times().sort((a, b) => a.order_index - b.order_index)
                        console.log('SORT', this.times())
                        this.clientName = ''
                        this.key = ''
                        this.keyDisp = ''
                        this.cdref.markForCheck()
                    }
                })
            }
        })
    }

    /**
     * Get the keyboard input and check if it is a valid key.
     * @param event - keyboard event
     */
    getKeyboardInput(event: KeyboardEvent) {
        const keyArray = this.times().map((time) => time.key)
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

    /**
     * End the day by stopping all running time entries and calculating the total time for the day.
     */
    endDay() {
        const user = this.authService.currentUser()
        if (!user) return
        const times = this.times().filter((time) => time.running === 1)
        if (times.length === 0) {
            this.calculateEndOfDayTotals()
        }
        times.forEach((time) => {
            this.timeService.stopTime(user.userId, time.total_time, time.current_time, time.id).then((res) => {
                this.calculateEndOfDayTotals()
            })
        })
    }

    /**
     * Calculate the total time for the day by filtering all time entries that have a total time greater than 30 minutes.
     * The total time is rounded up to the nearest hour.
     * The total time is then added to the endOfDayTimes array and the total time for the day is calculated by summing up all the values in the endOfDayTimes array.
     * The total time for the day is then displayed in the end day dialog window.
     */
    calculateEndOfDayTotals() {
        this.getTime()
        this.endOfDayTimes = this.times().filter((time) => time.total_time - 300000 > 0)
        this.endOfDayTimesTotal = this.endOfDayTimes
            .map((value) => {
                return (Math.ceil(((value.total_time - 300000) / (1000 * 60 * 60)) * 2) / 2).toFixed(2)
            })
            .reduce((a, b) => parseFloat(a.toString()) + parseFloat(b.toString()), 0)
        console.log(this.endOfDayTimesTotal)
        this.endDayDialog = true
        this.cdref.markForCheck()
    }

    /**
     * Reset all time entries for the current user.
     */
    resetTimes() {
        const user = this.authService.currentUser()
        if (!user) return
        this.timeService.resetAllTime(user.userId).then((res) => {
            this.getTime()
            this.endDayDialog = false
            this.cdref.markForCheck()
        })
    }

    /**
     * Delete a time entry from the database.
     * @param time - time entry to be deleted
     */
    deleteTimes(time: Time) {
        this.timeService.deleteTime(time.id).then((res) => {
            this.getTime()
        })
    }

    /**
     * Listener to trigger the correct dialog window based on the key pressed.
     * @param event - keyboard event
     */
    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (this.deleteDialog || this.endDayDialog || this.visible) return
        const keyArray = this.times().map((time) => time.key)
        if (event instanceof KeyboardEvent && keyArray.includes(event.code)) {
            const time = this.times().find((time) => time.key === event.code)
            if (!time) return
            if (time.running === 1) this.stopTime(time.id, time.total_time, time.current_time)
            else this.startTime(time.id)
        }
    }
}
