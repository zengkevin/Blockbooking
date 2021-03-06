import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import {
  PatientsListComponent,
  PatientThumbnailComponent,
  PatientService,
  PatientResolver,
  PatientDetailComponent,
  EditPatientComponent
} from './patient';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { NavbarComponent } from './nav/navbar.component';
import {
  ScheduleDayComponent,
  ScheduleNavComponent,
  ScheduleService,
  ScheduleItemComponent,
  BlockbookingItemComponent
} from './schedule';
import {
  EditAppointmentComponent,
  AppointmentService,
  AppointmentResolver
} from './appointment';
import { MOMENT_TOKEN } from './shared/moment.service';
import {
  BlockbookingComponent,
  BlockbookingService,
  BlockbookingResolver
} from './blockbooking';

const moment = window['moment'];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PatientsListComponent,
    PatientThumbnailComponent,
    PatientDetailComponent,
    EditPatientComponent,
    ScheduleDayComponent,
    ScheduleNavComponent,
    ScheduleItemComponent,
    EditAppointmentComponent,
    BlockbookingComponent,
    BlockbookingItemComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    PatientService,
    PatientResolver,
    ScheduleService,
    AppointmentService,
    AppointmentResolver,
    { provide: MOMENT_TOKEN, useValue: moment },
    BlockbookingService,
    BlockbookingResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
