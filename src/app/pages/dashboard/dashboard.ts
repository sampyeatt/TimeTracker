import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core'
import { TimeService } from '../../services/time.service'
import { AuthService } from '../../services/auth.service'
import { DialogService } from '../../services/dialog.service'
import { Button } from 'primeng/button'
import { DataView } from 'primeng/dataview'
import { Ripple } from 'primeng/ripple'
import { PrimeTemplate } from 'primeng/api'

/**
 * Dashboard page component.
 */
@Component({
    selector: 'app-dashboard',
    imports: [Button, DataView, Ripple, PrimeTemplate],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css'
})
export class DashboardComponent {
    private timeService = inject(TimeService)
    private authService = inject(AuthService)
    public dialogService = inject(DialogService)
    private cdref = inject(ChangeDetectorRef)

    /**
     * On Init get all times for the current user
     */
    constructor () {
        this.getTime()
        this.cdref.markForCheck()
    }

    /**
     * Get all times for the current user. If the user is not authenticated, get the user from the database and set the user in the auth service.
     */
    getTime () {
        const user = this.authService.currentUser()
        if (!user) {
            this.authService.setCurrentUser().then((auth) => {
                if (auth) {
                    const user = this.authService.currentUser()
                    if (!user) return
                    this.timeService.getTimeUserId(user.userId).then((res) => {
                        this.dialogService.setTimes(res, user.userId)
                    })
                }
            })
        } else {
            this.timeService.getTimeUserId(user.userId).then((res) => {
                this.dialogService.setTimes(res, user.userId)
            })
        }
    }

    /**
     * Start a time entry for a given time id. This will set the running flag to 1 for the time entry.
     * If a time entry is currently running, stop the currently running time entry and set the running flag to 0 for the new time entry.
     * @param timeId - time id number
     */
    startTime (timeId: number) {
        const user = this.authService.currentUser()
        if (!user) return
        const runningTimeIndex = this.dialogService.times().findIndex((time) => time.running === 1)
        const runningTime = this.dialogService.times()[runningTimeIndex]
        if (runningTimeIndex !== -1) {
            this.stopTime(runningTime.id, runningTime.total_time, runningTime.current_time)
            this.startUpdateTime(timeId)
        } else {
            this.startUpdateTime(timeId)
        }
    }

    /**
     * Start a time entry for a given time id. This will set the running flag to 1 for the time entry.
     * If a time entry is currently running, stop the currently running time entry and set the running flag to 0 for the new time entry.
     * @param timeId - time id number
     */
    startUpdateTime (timeId: number) {
        const date = Date.now()
        this.timeService.startTime(timeId, 1, date).then((res) => {
            if (res) {
                const timeIndex = this.dialogService.times().findIndex(value => value.id === timeId)
                if (timeIndex != -1) {
                    // @ts-ignore the index exists so the value exists
                    this.dialogService.times().at(timeIndex).running = 1
                    // @ts-ignore the index exists so the value exists
                    this.dialogService.times().at(timeIndex).current_time = date
                    this.cdref.markForCheck()
                }
            }
        })
    }

    /**
     * Stop a time entry for a given time id. This will set the running flag to 0 for the time entry.
     * If the total time is 0, set the total time to the current time.
     * @param timeId - time id number
     * @param totalTime - total time in milliseconds
     * @param currentTime - current time in milliseconds
     */
    stopTime (timeId: number, totalTime: number = 0, currentTime: number = 0) {
        const user = this.authService.currentUser()
        if (!user) return
        const date = Date.now()
        const updatedTotalTime = totalTime + (date - currentTime)
        this.timeService.stopTime(user?.userId, updatedTotalTime, timeId).then((res) => {
            if (res) {
                const timeIndex = this.dialogService.times().findIndex(value => value.id === timeId)
                if (timeIndex != -1) {
                    // @ts-ignore the index exists so the value exists
                    this.dialogService.times().at(timeIndex).running = 0
                    // @ts-ignore the index exists so the value exists
                    this.dialogService.times().at(timeIndex).total_time = updatedTotalTime
                    this.cdref.markForCheck()
                }
            }
        })
    }

    /**
     * Listener to trigger the correct dialog window based on the key pressed.
     * @param event - keyboard event
     */
    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent (event: KeyboardEvent) {
        if (this.dialogService.deleteDialog || this.dialogService.endDayDialog || this.dialogService.newTimeDialog)
            return
        if (event instanceof KeyboardEvent && this.dialogService.timeKeys().has(event.code)) {
            const time = this.dialogService.times().find((time) => time.key === event.code)
            if (!time) return
            if (time.running === 1) this.stopTime(time.id, time.total_time, time.current_time)
            else this.startTime(time.id)
        }
    }
}
