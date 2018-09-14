import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Blockbooking } from './blockbooking.model';
import { BlockbookingService } from './blockbooking.service';
import { Observable } from 'rxjs';

@Injectable()
export class BlockbookingResolver implements Resolve<Blockbooking> {
  constructor(private appointmentService: BlockbookingService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Blockbooking> {
    return this.appointmentService.getBlockbooking(route.params['id']);
  }
}
