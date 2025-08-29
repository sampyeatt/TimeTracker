import {computed, inject, Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {environment} from '../../environments/environment'
import {Time} from '../interface/api-interface'

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  apiUrl = computed(() => `${environment.API_URL}/api/drivers`)
  private http = inject(HttpClient)

  getTimeUserId(userId: number) {
    return this.http.get<Time[]>(`${this.apiUrl()}/byUserId/${userId}`)
  }

  newTime(userId: number, clientName: string, key: string) {
    return this.http.post(`${this.apiUrl()}/newTime`, {userId: userId, clientName: clientName, key: key})
  }

  updateTime(id: number, userId: number) {
    return this.http.put(`${this.apiUrl()}/updateTime`, {id: id, userId: userId})
  }

  stopAllTime(userId: number){
    return this.http.put(`${this.apiUrl()}/stopTime`, {userId: userId})
  }

  deleteTime(id: number){
    return this.http.delete(`${this.apiUrl()}/deleteTime/${id}`)
  }
}
