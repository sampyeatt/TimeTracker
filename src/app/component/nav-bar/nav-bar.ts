import { ChangeDetectorRef, Component, inject } from '@angular/core'
import { AuthService } from '../../services/auth.service'
import { TimeService } from '../../services/time.service'
import { Time } from '../../interface/api-interface'
import { DialogService } from '../../services/dialog.service'
import { Button } from 'primeng/button'
import { Dialog } from 'primeng/dialog'
import { FloatLabel } from 'primeng/floatlabel'
import { FormsModule } from '@angular/forms'
import { InputText } from 'primeng/inputtext'
import { Ripple } from 'primeng/ripple'
import { TableModule } from 'primeng/table'
import { RouterLink } from '@angular/router'

/**
 * Nav bar component.
 */
@Component({
    selector: 'app-nav-bar',
    imports: [Button, Dialog, FloatLabel, FormsModule, InputText, Ripple, TableModule, RouterLink],
    templateUrl: './nav-bar.html',
    styleUrl: './nav-bar.css'
})
export class NavBarComponent {
    private authService = inject(AuthService)
    private timeService = inject(TimeService)
    public dialogService = inject(DialogService)
    private cdref = inject(ChangeDetectorRef)
    clientName: string = ''
    invalidKey: boolean = false
    key: string = ''
    keyDisp: string = ''
    keycode: number | undefined
    endOfDayTimes: Time[] = []
    endOfDayTimesTotal: number = 0

    /**
     * Getter to check if user is authenticated.
     * @returns boolean - true if user is authenticated, false otherwise
     */
    get authenticated () {
        return !!this.authService.currentUser()
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
     * trigger to show dialog window
     */
    showDialog () {
        this.dialogService.newTimeDialog = true
        if (this.dialogService.timeKeys().size === 0) {
            this.dialogService.times().map((time) => {
                if (!this.dialogService.timeKeys().has(time.key) && time.id > 0) {
                    this.dialogService.timeKeys().add(time.key)
                }
            })
        }
    }

    /**
     * Get the keyboard input and check if it is a valid key.
     * @param event - keyboard event
     */
    getKeyboardInput (event: KeyboardEvent) {
        console.log(event)
        if (event instanceof KeyboardEvent && this.dialogService.timeKeys().has(event.code)) {
            this.invalidKey = true
            this.cdref.markForCheck()
            return
        } else {
            this.invalidKey = false
            this.key = event.code
            this.keyDisp = event.code
            this.keycode = this.dialogService.availableKeys.get(this.key)
            this.cdref.markForCheck()
        }
    }

    /**
     * Add a new time entry to the database.
     */
    newTime () {
        const user = this.authService.currentUser()
        if (!user) return
        console.log(this.clientName + ' ' + this.key)
        if (!this.invalidKey && this.keycode != undefined) {
            this.timeService.newTime(user.userId, this.clientName, this.key, this.keycode).then((res) => {
                if (res && res.lastInsertId !== undefined) {
                    this.timeService.getTimeTimeId(res.lastInsertId).then((res) => {
                        if (res) {
                            this.dialogService.times()[res.order_index - 1] = res
                            this.dialogService.timeKeys().add(this.key)
                            this.clientName = ''
                            this.key = ''
                            this.keyDisp = ''
                            this.cdref.markForCheck()
                        }
                    })
                }
            })
        }
    }

    /**
     * End the day by stopping all running time entries and calculating the total time for the day.
     */
    endDay () {
        const user = this.authService.currentUser()
        if (!user) return
        const times = this.dialogService.times().filter((time) => time.running === 1)
        if (times.length === 0) {
            this.calculateEndOfDayTotals()
        }
        times.forEach((time) => {
            this.timeService.stopTime(user.userId, time.total_time, time.current_time, time.id).then(() => {
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
    calculateEndOfDayTotals () {
        this.getTime()
        this.endOfDayTimes = this.dialogService.times().filter((time) => time.total_time - 300000 > 0)
        this.endOfDayTimesTotal = this.endOfDayTimes
            .map((value) => {
                return (Math.ceil(((value.total_time - 300000) / (1000 * 60 * 60)) * 2) / 2).toFixed(2)
            })
            .reduce((a, b) => parseFloat(a.toString()) + parseFloat(b.toString()), 0)
        this.dialogService.endDayDialog = true
        this.cdref.markForCheck()
    }

    /**
     * Reset all time entries for the current user.
     */
    resetTimes () {
        const user = this.authService.currentUser()
        if (!user) return
        this.timeService.resetAllTime(user.userId).then(() => {
            this.getTime()
            this.dialogService.endDayDialog = false
            this.cdref.markForCheck()
        })
    }

    /**
     * Delete a time entry from the database.
     * @param time - time entry to be deleted
     */
    deleteTimes (time: Time) {
        this.timeService.deleteTime(time.id).then(() => {
            this.dialogService.timeKeys().delete(time.key)
            this.getTime()
            this.cdref.markForCheck()
        })
    }

    protected readonly Math = Math
}
