const database = require('./database');
const moment = require('moment');

/**
 * Persistence layer for blockbookings
 * 
 * This class is responsible for mapping between the string type of the blockbooking id
 * and the internal integer representation in the database.
 */

/**
 * @returns { Blockbooking[] } Array of all blockbookings
 */
exports.getAll = async () => {
  const db = database.getDatabase();
  const rows = await db.all(BLOCKBOOKING_QUERY);
  return rows.map(mapRowToBlockbooking);
};

/**
 * @param { string } id Blockbooking's unique ID
 * @returns { Blockbooking }
 */
exports.get = async (id) => {
  const db = database.getDatabase();
  const row = await db.get(BLOCKBOOKING_QUERY + BLOCKBOOKING_FILTER_BY_ID, { $id: +id });
  if (!row) {
    return null;
  }
  return mapRowToBlockbooking(row);
};

/**
 * Return all blockbookings whose start time is in the half-open range [start, end) where start
 * and end are both in UTC.
 * 
 * @param { Moment } start Start time in UTC
 * @param { Moment } end End time in UTC
 * @returns { Blockbooking[] } Array of all blockbookings starting between [start, end)
 */
exports.getBetween = async (start, end) => {
  const db = database.getDatabase();

  const rows = await db.all(
    BLOCKBOOKING_QUERY + BLOCKBOOKING_FILTER_BY_TIME,
    { $start: start.utc().format(), $end: end.utc().format() }
  );

  //Check recurrances
  if(rows.length==0) {
    const rowsRecurrence = await db.all(
      BLOCKBOOKING_QUERY + `WHERE start_time <= $start AND recurrence LIKE $weekday`,
      { $start: start.utc().format(), $weekday: '%' + start.day() + '%' }
    );
console.log("rowsRecurrence", rowsRecurrence);
    rowsRecurrence.forEach( row => {
      if(row.dateEnd && moment(row.dateEnd) >= start) {
        let startTime = moment(row.start_time);
        row.start_time = moment([
          start.year(),
          start.month(),
          start.day(),
          startTime.hour(),
          startTime.minutes()
        ]);
        rows.push(row);
      }
    });
  }

  return rows.map(mapRowToBlockbooking);
};

/**
 * @param { Blockbooking } blockbooking Blockbooking to create
 * @returns { Blockbooking } Created blockbooking object with id set
 */
exports.create = async (blockbooking) => {
  const db = database.getDatabase();
  let result = await db.run(
    'INSERT INTO blockbookings (description, start_time, duration, recurrence, dateEnd) VALUES ($description, $startTime, $duration, $recurrence, $dateEnd)', {
      $description: blockbooking.description,
      $startTime: blockbooking.startTime.format('YYYY-MM-DDTHH:mm:ss\\Z'),
      $duration: blockbooking.duration,
      $recurrence: blockbooking.recurrence,
      $dateEnd: blockbooking.dateEnd
    }
  );
  if (!result.lastID) {
    throw new Error('Failed to create blockbooking');
  }
  blockbooking.id = '' + result.lastID;
  return exports.get('' + result.lastID);
};

/**
 * @param { Blockbooking } blockbooking Blockbooking to update based upon blockbooking's id
 * @returns { Blockbooking } Updated blockbooking object
 * @throws If no blockbooking or patient exists with id
 */
exports.update = async (blockbooking) => {
  const db = database.getDatabase();
  let result = null;
  try {
    result = await db.run(
      `UPDATE blockbookings
     SET
       decription = $decription,
       start_time = $startTime,
       duration = $duration,
       recurrence = $recurrence,
       dateEnd = $dateEnd
     WHERE
       id = $id
    `, {
        $id: +blockbooking.id,
        $decription: blockbooking.decription,
        $startTime: blockbooking.startTime.format('YYYY-MM-DDTHH:mm:ss\\Z'),
        $duration: blockbooking.duration,
        $recurrence: blockbooking.recurrence,
        $dateEnd: blockbooking.dateEnd
      }
    );
  } catch (err) {
    if (/SQLITE_CONSTRAINT/.test(err.message)) {
      throw new Error(`Failed to update blockbooking with id '${blockbooking.id}', no patient with id '${blockbooking.patientId}'`);
    }
    throw err;
  }
  if (!result.changes) {
    throw new Error(`Failed to update blockbooking with id '${blockbooking.id}'`);
  }
  return exports.get(blockbooking.id);
};

/**
 * @param { string } id Blockbooking's unique ID
 */
exports.delete = async (id) => {
  const db = database.getDatabase();

  const row = await db.run('DELETE FROM blockbookings WHERE id = $id', +id);
  if (!row.changes) {
    throw new Error(`Failed to delete blockbooking id '${id}'`);
  }
};

const BLOCKBOOKING_QUERY = `
  SELECT 
    blockbookings.id AS id,
    description,
    start_time,
    duration,
    recurrence,
    dateEnd
  FROM
    blockbookings
  `;

const BLOCKBOOKING_FILTER_BY_ID = 'WHERE blockbookings.id = $id';
const BLOCKBOOKING_FILTER_BY_TIME = 'WHERE start_time >= $start AND start_time < $end';

function mapRowToBlockbooking(row) {
  return {
    id: '' + row.id,
    description: '' + row.description,
    startTime: moment.utc(row.start_time),
    duration: row.duration,
    recurrence: row.recurrence,
    dateEnd: row.dateEnd
  };
}
