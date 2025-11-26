import {computed, inject, Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {environment} from '../../environments/environment.development'
import {StopResponse, Time, UpdateResponse} from '../interface/api-interface'
import {share} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  apiUrl = computed(() => `${environment.API_URL}/api/time`)
  private http = inject(HttpClient)

  getTimeUserId(userId: number) {
    return this.http.get<Time[]>(`${this.apiUrl()}/byUserId/${userId}`).pipe(share())
  }

  newTime(userId: number, clientName: string, key: string) {
    return this.http.post<Time>(`${this.apiUrl()}/newTime`, {userId: userId, client_name: clientName, key: key})
  }

  updateTime(id: number, userId: number) {
    return this.http.put<UpdateResponse>(`${this.apiUrl()}/updateTime`, {id: id, userId: userId})
  }

  stopAllTime(userId: number){
    return this.http.put<StopResponse>(`${this.apiUrl()}/stopTime`, {userId: userId})
  }

  resetAllTime(userId: number){
    return this.http.put<StopResponse>(`${this.apiUrl()}/resetTime`, {userId: userId})
  }

  deleteTime(id: number){
    return this.http.delete(`${this.apiUrl()}/deleteTime/${id}`)
  }
}
