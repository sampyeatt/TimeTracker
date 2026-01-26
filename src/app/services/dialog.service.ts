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
}
