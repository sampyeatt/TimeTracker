import { Injectable, signal } from '@angular/core'
import { Time } from '../interface/api-interface'

/**
 *
 */
@Injectable({
    providedIn: 'root'
})
export class DialogService {
    newTimeDialog = false
    endDayDialog = false
    deleteDialog = false
    times = signal<Time[]>([])
    timeKeys = signal(new Set<string>())
    availableKeys = new Map<string, number>([
        ['F9', 1],
        ['F10', 2],
        ['F11', 3],
        ['F12', 4],
        ['F13', 5],
        ['F14', 6],
        ['F15', 7],
        ['F16', 8],
        ['F17', 9],
        ['F18', 10],
        ['F19', 11],
        ['F20', 12],
        ['F21', 13],
        ['F22', 14],
        ['F23', 15],
        ['F24', 16]
    ])

    /**
     * Fill time array with blanks
     * @param userid user id
     */
    constructBlankArray (userid: number) {
        console.log('KEYS AVAIL', this.timeKeys())
        for (const [k, v] of this.availableKeys) {
            if (!this.timeKeys().has(k)) {
                this.times().push({
                    id: v * -1,
                    client_name: '',
                    key: k,
                    userId: userid,
                    running: 0,
                    current_time: 0,
                    total_time: 0,
                    order_index: v
                })
            }
        }
        this.times().sort((a, b) => a.order_index - b.order_index)
        console.log('times', this.times())
    }

    /**
     * set times
     * @param t jmk
     * @param currentUserId user id
     */
    setTimes (t: Time[], currentUserId: number) {
        this.times.set(t)
        t.forEach((v: Time) => {
            if (!this.timeKeys().has(v.key)) {
                this.timeKeys().add(v.key)
            }
        })
        if (this.times().length < 16) {
            this.constructBlankArray(currentUserId)
        }
    }
}
