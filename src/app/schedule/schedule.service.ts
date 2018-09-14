import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Appointment } from './appointment.model';
import { MOMENT_TOKEN } from '../shared/moment.service';
import { Blockbooking } from '../blockbooking/blockbooking.model';

@Injectable()
export class ScheduleService {
  private tz: string;

  constructor(private http: HttpClient, @Inject(MOMENT_TOKEN) private moment: any) {
    this.tz = moment.tz.guess();
  }

  getSchedule(date: string) {
    return this.http.get('/api/appointments/' + date + '?tz=' + this.tz)
      .pipe(map(response => <Appointment[]>response['appointments']));
  }

  delete(appointment: Appointment) {
    return this.http.delete<null>('/api/appointments/' + appointment.id)
      .toPromise<null>();
  }

  getBlockbooking(date: string) {
    return this.http.get('/api/blockbookings/' + date + '?tz=' + this.tz)
      .pipe(map(response => <Blockbooking[]>response['blockbookings']));
  }

  remove(blockbooking: Blockbooking) {
    return this.http.delete<null>('/api/blockbookings/' + blockbooking.id)
      .toPromise<null>();
  }

}
