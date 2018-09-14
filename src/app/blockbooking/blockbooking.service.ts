import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blockbooking } from './blockbooking.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MOMENT_TOKEN } from '../shared/moment.service';

@Injectable()
export class BlockbookingService {
  constructor(private http: HttpClient, @Inject(MOMENT_TOKEN) private moment: any) { }

  getBlockbooking(id: string): Observable<Blockbooking> {
    return this.http
      .get<Blockbooking>('/api/blockbookings/' + id)
      .pipe(map(result => this.mapFromHttp(result)));
  }

  saveBlockbooking(blockbooking: Blockbooking): Observable<Blockbooking> {
    if (blockbooking.id) {
      return this.http
        .put<Blockbooking>(`/api/blockbookings/${blockbooking.id}`, this.mapToHttp(blockbooking))
        .pipe(map(result => this.mapFromHttp(result)));
    } else {
      return this.http
        .post<Blockbooking>('/api/blockbookings', this.mapToHttp(blockbooking))
        .pipe(map(result => this.mapFromHttp(result)));
    }
  }

  private mapFromHttp(blockbooking: any): Blockbooking {
    return {
      id: blockbooking.id,
      description: blockbooking.description,
      startTime: this.moment(blockbooking.startTime),
      duration: blockbooking.duration,
      recurrence: blockbooking.recurrence,
      dateEnd: blockbooking.dateEnd
    };
  }

  private mapToHttp(blockbooking: Blockbooking): any {
    const output = {
      id: blockbooking.id || undefined,
      description: blockbooking.description,
      startTime: blockbooking.startTime.utc().format('YYYY-MM-DDTHH:mm:ss\\Z'),
      duration: blockbooking.duration,
      recurrence: blockbooking.recurrence,
      dateEnd: blockbooking.dateEnd
    };
    if (!blockbooking.id) {
      delete output.id;
    }
    return output;
  }
}
