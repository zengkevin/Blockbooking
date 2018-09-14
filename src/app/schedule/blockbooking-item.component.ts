import { Component, Input, Inject, Output, EventEmitter } from '@angular/core';
import { Blockbooking } from '../blockbooking/blockbooking.model';
import { MOMENT_TOKEN } from '../shared/moment.service';
import { IconDefinition, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'drp-blockbooking-item',
  templateUrl: './blockbooking-item.component.html',
  styles: [`
    .card { padding: 10px; }
    fa-icon { cursor: pointer; color: rgba(255, 255, 255, 0.75); }
    fa-icon:hover { color: #fff }
  `]
})
export class BlockbookingItemComponent {
  @Input() blockbooking: Blockbooking;
  @Output() delete = new EventEmitter<Blockbooking>();
  deleteIcon: IconDefinition;

  constructor(@Inject(MOMENT_TOKEN) private moment: any) {
    this.deleteIcon = faTrash;
  }

  formatTime() {
    const start = this.moment(this.blockbooking.startTime);
    const end = start.clone().add(this.blockbooking.duration, 'minute');

    return `${start.format('LT')} - ${end.format('LT')}`;
  }

  recurrenceFormatTime() {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let recurrences = "";

    if(this.blockbooking.recurrence.length) {
      recurrences += "Repeat weekly:"
      this.blockbooking.recurrence.split('').forEach( num => {
        recurrences += ' ' + weekdays[num];
      });
    }

    return recurrences;
  }
}
