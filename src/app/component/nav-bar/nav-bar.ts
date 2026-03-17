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
import { TableModule } from 'primeng/table'
import { RouterLink } from '@angular/router'

/**
 * Nav bar component.
 */
@Component({
    selector: 'app-nav-bar',
    imports: [Button, Dialog, FloatLabel, FormsModule, InputText, TableModule, RouterLink],
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
    endOfDayTimes: Time[] = []
    endOfDayTimesTotal: number = 0

    /**
     * Getter to check if the user is authenticated.
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
        if (event instanceof KeyboardEvent && this.dialogService.timeKeys().has(event.code)) {
            this.invalidKey = true
            this.cdref.markForCheck()
            return
        } else {
            this.invalidKey = false
            this.key = event.code
            this.keyDisp = event.code
            this.cdref.markForCheck()
        }
    }

    /**
     * Get the keyboard input and check if it is a valid key.
     * @param event - keyboard event
     * @param index index
     */
    getKeyboardInputUpdate (event: KeyboardEvent, index: number) {
        if (event instanceof KeyboardEvent && this.dialogService.timeKeys().has(event.code)) {
            this.invalidKey = true
            this.dialogService.timeKeys().clear()
            this.dialogService.times().map((time) => {
                if (time.id > 0) this.dialogService.timeKeys().add(time.key)
            })
            this.cdref.markForCheck()
            return
        } else {
            this.invalidKey = false
            this.dialogService.timeKeys().clear()
            // @ts-ignore
            this.dialogService.times().at(index).key = event.code
            this.dialogService.times().map((time) => {
                if (time.id > 0) this.dialogService.timeKeys().add(time.key)
            })
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
        const keycode = this.dialogService.availableKeys.get(this.key)
        if (!this.invalidKey && keycode != undefined) {
            this.timeService.newTime(user.userId, this.clientName, this.key, keycode).then((res) => {
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
        } else {
            const date = Date.now()
            times.forEach((time) => {
                const updatedTotalTime = time.total_time + (date - time.current_time)
                this.timeService.stopTime(user.userId, updatedTotalTime, time.id).then((res) => {
                    if (res) {
                        const timeIndex = this.dialogService.times().findIndex(value => value.id === time.id)
                        if (timeIndex != -1) {
                            // @ts-ignore the index exists so the value exists
                            this.dialogService.times().at(timeIndex).running = 0
                            // @ts-ignore the index exists so the value exists
                            this.dialogService.times().at(timeIndex).total_time = updatedTotalTime
                            this.cdref.markForCheck()
                        }
                    }
                    this.calculateEndOfDayTotals()
                })
            })
        }
    }

    /**
     * Calculate the total time for the day by filtering all time entries that have a total time greater than 30 minutes.
     * The total time is rounded up to the nearest hour.
     * The total time is then added to the endOfDayTimes array and the total time for the day is calculated by summing up all the values in the endOfDayTimes array.
     * The total time for the day is then displayed in the end day dialog window.
     */
    calculateEndOfDayTotals () {
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

    /**
     * Update time
     * @param time time
     */
    updateTimes (time: Time) {
        console.log('Time:', time)
        const newOrderIndex = this.dialogService.availableKeys.get(time.key)
        if (newOrderIndex !== undefined) {
            time.order_index = newOrderIndex
            this.timeService.updateTime(time).then(r => {
                this.getTime()
                this.cdref.markForCheck()
            })
        }
    }

    /**
     * cancel changes
     * @param time time
     */
    cancelChanges (time: Time) {
        this.dialogService.timeKeys().delete(time.key)
        this.getTime()
        this.cdref.markForCheck()
    }

    protected readonly Math = Math
}
