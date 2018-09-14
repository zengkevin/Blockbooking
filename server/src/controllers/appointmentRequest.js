const moment = require('moment');

/**
 * Parses and validates an HTTP request body to ensure it is a correctly formed request
 * to create or update an appointment.
 */
class AppointmentRequest {
  constructor(id, body, allBlockBookings) {
    this._allBlockBookings = allBlockBookings;

    let messages = this.getValidationMessages(id, body);
    if (messages.length) {
      const error = new Error('Request contains one or more validation errors');
      error.messages = messages;
      throw error;
    }

    this._appointment = {};
    if (id) {
      this._appointment.id = id;
    }
    this._appointment.patientId = body.patientId;
    this._appointment.startTime = moment.utc(body.startTime);
    this._appointment.duration = body.duration;
  }

  get appointment() {
    return this._appointment;
  }

  IsOverlapped(blockbooking, startTime, duration) {
    let startTimeMoment = moment(startTime, 'YYYY-MM-DDTHH:mm:ss\\Z')
    let startTimeToCheck = startTimeMoment.valueOf();
    let endTimeToCheck = startTimeToCheck  + duration * 1000;
    let dayOfWeek = startTimeMoment.day();

    let blockbookingStartTimeMoment = moment(blockbooking.startTime, 'YYYY-MM-DDTHH:mm:ss\\Z');
    let recurrenceStartMoment = moment([
      startTimeMoment.year(),
      startTimeMoment.month(),
      startTimeMoment.date(),
      blockbookingStartTimeMoment.hour(),
      blockbookingStartTimeMoment.minutes()
    ]);
    let recurrenceStartTime = recurrenceStartMoment.valueOf();
    let recurrenceEndTime = recurrenceStartTime + blockbooking.duration * 1000;
    if(recurrenceStartTime>=startTimeToCheck && recurrenceStartTime<=endTimeToCheck)
      return true;
    if(recurrenceEndTime>=startTimeToCheck && recurrenceEndTime<=endTimeToCheck)
      return true;

    if(blockbooking.recurrence.length) {
      if(blockbooking.recurrence.indexOf(dayOfWeek)>=0) {
        let endDateTime = moment(blockbooking.dateEnd, 'YYYY-MM-DDTHH:mm:ss\\Z').valueOf();
        let weeklyTime = 7 * 24 * 3600 * 1000;
        recurrenceStartTime += weeklyTime;
        while (recurrenceStartTime <= endDateTime) {
          recurrenceEndTime += weeklyTime;
          if(recurrenceStartTime>=startTimeToCheck && recurrenceStartTime<=endTimeToCheck)
            return true;
          if(recurrenceEndTime>=startTimeToCheck && recurrenceEndTime<=endTimeToCheck)
            return true;

            recurrenceStartTime += weeklyTime;
        }
      }
    } 

    return false;
  }

  IsTimeBlockBooking(startTime, duration) {
    if(this._allBlockBookings) {
      for(let index=0; index < this._allBlockBookings.length; index++) {
        if(this.IsOverlapped(this._allBlockBookings[index], startTime, duration)) {
          return true;
        }
      }
    }

    return false;
  }

  getValidationMessages(id, body) {
    let errors = [];

    if (body.id) {
      if (!id) {
        errors.push('new appointment must not have an id');
      } else if (id !== body.id) {
        errors.push(`updated appointment id in body '${body.id}' does not match resource '${id}'`);
      }
    }

    if (!body.patientId) {
      errors.push('appointment must have a patientId');
    }

    if (!body.startTime) {
      errors.push('appointment must have a startTime');
    } else {
      let utcDate = moment.utc(body.startTime, moment.ISO_8601, true);
      let localDate = moment(body.startTime, moment.ISO_8601, true);
      if (!utcDate.isValid()) {
        errors.push(`appointment startTime '${body.startTime}' is not a valid ISO-8601 date`);
      } else if (utcDate.toISOString() !== localDate.toISOString()) {
        errors.push(`appointment startTime '${body.startTime}' must be in UTC or have an offset`);
      }
    }

    if (Number(body.duration) !== body.duration || !Number.isInteger(Number(body.duration))) {
      errors.push('appointment must have a integer duration');
    } else {
      if (body.duration < 0) {
        errors.push(`appointment duration '${body.duration}' must be positive`);
      }
    }

    if(errors.length==0 && this.IsTimeBlockBooking(body.startTime, body.duration)) {
      errors.push(`appointment startTime '${body.startTime}' is in a peroid of blockbooking time!`);
    }

    return errors;
  }
}

/**
 * Construct a AppointmentRequest object from a request to create a new appointment
 * 
 * @param {Object} body - An HTTP request body
 * @throws if the request is not correctly formed
 */
function forCreate(body, allBlockBookings=null) {
  return new AppointmentRequest(null, body, allBlockBookings);
}

/**
 * Construct a AppointmentRequest object from a request to update an existing appointment 
 * 
 * @param {string} id - appointment id from the resource URI
 * @param {Object} body - An HTTP request body
 * @throws if the request is not correctly formed
 */
function forUpdate(id, body, allBlockBookings=null) {
  return new AppointmentRequest(id, body, allBlockBookings);
}

module.exports = {
  forCreate,
  forUpdate
};
