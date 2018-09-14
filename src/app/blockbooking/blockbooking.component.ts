import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Blockbooking } from '../blockbooking/blockbooking.model';
import { MOMENT_TOKEN } from '../shared/moment.service';
import { BlockbookingService } from '../blockbooking/blockbooking.service';

const DEFAULT_BLOCKBOOKING_DURATION = 60;

@Component({
  selector: 'app-blockbooking',
  templateUrl: './blockbooking.component.html',
  styles: [`
    em { float: right; color: #E05C65; padding-left: 10px; }
    .error input { background-color: #E3C3C5; }
    .error ::-webkit-input-placeholder { color: #999; }
    .error ::-moz-placeholder { color: #999; }
    .error :-moz-placeholder { color: #999; }
    .error :ms-input-placeholder { color: #999; }
  `]
})
export class BlockbookingComponent implements OnInit {
  description = new FormControl('', Validators.required);
  // Access to native elements required because Angular doesn't bind to valueAsDate
  @ViewChild('dateEl') dateEl: ElementRef;
  @ViewChild('timeEl') timeEl: ElementRef;
  @ViewChild('dateEl2') dateEl2: ElementRef;
  date = new FormControl('', Validators.required);
  time = new FormControl('', Validators.required);
  duration = new FormControl(
    DEFAULT_BLOCKBOOKING_DURATION,
    [Validators.required, Validators.min(0), Validators.max(1439)]
  );
  repeatMonday = new FormControl(false, Validators.required);
  repeatTuesday = new FormControl(false, Validators.required);
  repeatWednesday = new FormControl(false, Validators.required);  
  repeatThursday = new FormControl(false, Validators.required);
  repeatFriday = new FormControl(false, Validators.required);
  repeatSaturday = new FormControl(false, Validators.required);
  repeatSunday = new FormControl(false, Validators.required);
  dateEnd = new FormControl('', Validators.required);

  form: FormGroup;

  // Either a new blockbooking based on a Patient or an existing Blockbooking
  blockbooking: Blockbooking;

  saveError: string;

  constructor(
    fb: FormBuilder,
    @Inject(MOMENT_TOKEN) private moment: any,
    private router: Router,
    private route: ActivatedRoute,
    private blockbookingService: BlockbookingService
  ) {
    this.form = fb.group({
      'description': this.description,
      'date': this.date,
      'time': this.time,
      'duration': this.duration,
      'repeatMonday': this.repeatMonday,
      'repeatTuesday': this.repeatTuesday,
      'repeatWednesday': this.repeatWednesday,
      'repeatThursday': this.repeatThursday,
      'repeatFriday': this.repeatFriday,
      'repeatSaturday': this.repeatSaturday,
      'repeatSunday': this.repeatSunday,
      'dateEnd': this.dateEnd
    });
  }

  ngOnInit() {
    const now = this.moment();
    this.route.data.forEach(data => {
      this.blockbooking = {
        description: 'Description',
        startTime: this.moment(now.utc().format('YYYY-MM-DDTHH:00:00\\Z')),
        duration: DEFAULT_BLOCKBOOKING_DURATION,
        recurrence: '',
        dateEnd: this.moment(now.utc().format('YYYY-MM-DD'))
      };

      this.description.setValue(this.blockbooking.description);
      this.date.setValue(this.blockbooking.startTime.format('YYYY-MM-DD'));
      this.time.setValue(this.blockbooking.startTime.format('HH:mm'));
      this.duration.setValue(this.blockbooking.duration);
      this.repeatMonday.setValue(false);
      this.repeatTuesday.setValue(false);
      this.repeatWednesday.setValue(false);
      this.repeatThursday.setValue(false);
      this.repeatFriday.setValue(false);
      this.repeatSaturday.setValue(false);      
      this.repeatSunday.setValue(false);
      this.dateEnd.setValue(this.blockbooking.dateEnd.format('YYYY-MM-DD')); 
    });

    this.repeatMonday.valueChanges.subscribe(value=> {
      this.updateRecurrence(value, "1");
    });

    this.repeatTuesday.valueChanges.subscribe(value=> {
      this.updateRecurrence(value, "2");
    });

    this.repeatWednesday.valueChanges.subscribe(value=> {
      this.updateRecurrence(value, "3");
    });

    this.repeatThursday.valueChanges.subscribe(value=> {
      this.updateRecurrence(value, "4");
    });

    this.repeatFriday.valueChanges.subscribe(value=> {
      this.updateRecurrence(value, "5");
    });

    this.repeatSaturday.valueChanges.subscribe(value=> {
      this.updateRecurrence(value, "6");
    });

    this.repeatSunday.valueChanges.subscribe(value=> {
      this.updateRecurrence(value, "0");
    });
  }

  updateRecurrence(value, weekday){  
    let index = this.blockbooking.recurrence.indexOf(weekday);
    if(value) {
      if(index<0) this.blockbooking.recurrence += weekday;
    }
    else {
      if(index>=0) {
        let chars = this.blockbooking.recurrence.split('');
        chars.splice(index, 1);
        this.blockbooking.recurrence = chars.join('');
      }
    }
  }

  saveBlockbooking(formValue) {
    this.blockbooking.description = formValue.description;
    this.blockbooking.startTime = this.createMomentFromFormElements();
    this.blockbooking.duration = +formValue.duration;
    this.blockbooking.recurrence =  (formValue.repeatMonday? '1':'') 
                                      + (formValue.repeatTuesday? '2':'')
                                      + (formValue.repeatWednesday? '3':'')
                                      + (formValue.repeatThursday? '4':'')
                                      + (formValue.repeatFriday? '5':'')
                                      + (formValue.repeatSaturday? '6':'')
                                      + (formValue.repeatSunday? '0':'');
    this.blockbooking.dateEnd = this.createEndDateMomentFromFormElements();
    this.saveError = '';

    this.blockbookingService.saveBlockbooking(this.blockbooking).subscribe((result: Blockbooking) => {
      this.router.navigate(['/schedule', result.startTime.format('YYYY-MM-DD')]);
    }, (error: Error) => {
      this.saveError = error.message;
    });
  }

  /**
   * Handles the trickiest part of this component - dealing with HTML date and time input
   * controls and JavaScripts legacy Date object.
   *
   * Retrieves the UTC values from the controls which will, surprisingly, actually be in
   * local time.  If the local calls are used the time will be off by an amount equal to
   * the browser's timezone offset (e.g. -6 hours in MDT).
   */
  private createMomentFromFormElements() {
    return this.moment([
      this.dateEl.nativeElement.valueAsDate.getUTCFullYear(),
      this.dateEl.nativeElement.valueAsDate.getUTCMonth(),
      this.dateEl.nativeElement.valueAsDate.getUTCDate(),
      this.timeEl.nativeElement.valueAsDate.getUTCHours(),
      this.timeEl.nativeElement.valueAsDate.getUTCMinutes()
    ]);
  }

  private createEndDateMomentFromFormElements() {
    return this.moment([
      this.dateEl2.nativeElement.valueAsDate.getUTCFullYear(),
      this.dateEl2.nativeElement.valueAsDate.getUTCMonth(),
      this.dateEl2.nativeElement.valueAsDate.getUTCDate(),
      this.timeEl.nativeElement.valueAsDate.getUTCHours(),
      this.timeEl.nativeElement.valueAsDate.getUTCMinutes()
    ]).add(this.duration, 'minutes');
  }

  cancel() {
    this.router.navigate(['/schedule']);
  }
}
