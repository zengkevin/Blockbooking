const moment = require('moment');

/**
 * Parses and validates an HTTP request body to ensure it is a correctly formed request
 * to create or update an blockbooking.
 */
class BlockbookingRequest {
  constructor(id, body) {
    let messages = this.getValidationMessages(id, body);
    if (messages.length) {
      const error = new Error('Request contains one or more validation errors');
      error.messages = messages;
      throw error;
    }

    this._blockbooking = {};
    if (id) {
      this._blockbooking.id = id;
    }
    this._blockbooking.description = body.description;
    this._blockbooking.startTime = moment.utc(body.startTime);
    this._blockbooking.duration = body.duration;
    this._blockbooking.recurrence = body.recurrence;
    this._blockbooking.dateEnd = body.dateEnd;
  }

  get blockbooking() {
    return this._blockbooking;
  }

  getValidationMessages(id, body) {
    let errors = [];

    if (!body.description) {
      errors.push('blockbooking must have a description');
    }

    if (!body.startTime) {
      errors.push('blockbooking must have a startTime');
    } else {
      let utcDate = moment.utc(body.startTime, moment.ISO_8601, true);
      let localDate = moment(body.startTime, moment.ISO_8601, true);
      if (!utcDate.isValid()) {
        errors.push(`blockbooking startTime '${body.startTime}' is not a valid ISO-8601 date`);
      } else if (utcDate.toISOString() !== localDate.toISOString()) {
        errors.push(`blockbooking startTime '${body.startTime}' must be in UTC or have an offset`);
      }
    }

    if (Number(body.duration) !== body.duration || !Number.isInteger(Number(body.duration))) {
      errors.push('blockbooking must have a integer duration');
    } else {
      if (body.duration < 0) {
        errors.push(`blockbooking duration '${body.duration}' must be positive`);
      }
    }

    return errors;
  }
}

/**
 * Construct a BlockbookingRequest object from a request to create a new blockbooking
 * 
 * @param {Object} body - An HTTP request body
 * @throws if the request is not correctly formed
 */
function forCreate(body) {
  return new BlockbookingRequest(null, body);
}

/**
 * Construct a BlockbookingRequest object from a request to update an existing blockbooking 
 * 
 * @param {string} id - blockbooking id from the resource URI
 * @param {Object} body - An HTTP request body
 * @throws if the request is not correctly formed
 */
function forUpdate(id, body) {
  return new BlockbookingRequest(id, body);
}

module.exports = {
  forCreate,
  forUpdate
};
