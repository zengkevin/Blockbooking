/**
 * Read and delete routes for blockbookings.  Create and update left as an exercise to the reader.
 */

const moment = require('moment-timezone');
const blockbookings = require('../models/blockbookings');
const { forCreate, forUpdate } = require('./blockbookingRequest');

exports.blockbookings_list = async function (_, res) {
  const allBlockbookings = await blockbookings.getAll();
  res.status(200).json({blockbookings: allBlockbookings.map(mapToHttp)});
};

exports.blockbookings_showById = async function (req, res) {
  const blockbooking = await blockbookings.get(req.params.id);
  if (blockbooking) {
    return res.status(200).json(mapToHttp(blockbooking));
  }
  res.status(404).send();
};

/**
 * Returns a list of all blockbookings occurring within a single day where
 * the start and end of the day are defined by the tz query parameter.  Defaults
 * to Etc/UTC where tz is not present.
 */
exports.blockbookings_showByDate = async function (req, res) {
  const tz = req.query.tz || 'Etc/UTC';
  if (!moment.tz.zone(tz)) {
    return res.status(400).send();
  }

  const date = moment.tz(req.params.date, 'YYYY-MM-DD', true, tz);
  if (!date.isValid()) {
    return res.status(404).send();
  }

  const blockbookingsOnDay = await blockbookings.getBetween(date, date.clone().add(1, 'day'));
  return res.status(200).json({ blockbookings: blockbookingsOnDay.map(mapToHttp) });
};

exports.blockbookings_create = async function (req, res) {

  try {
    const request = forCreate(req.body);
    let blockbooking = await blockbookings.create(request.blockbooking);
    return res.status(201).json(mapToHttp(blockbooking));
  } catch (err) {
    return res.status(400).send();
  }
};

exports.blockbookings_update = async function (req, res) {
  let request = null;
  try {
    request = forUpdate(req.params.id, req.body);
  } catch (err) {
    return res.status(400).send();
  }

  try {
    let blockbooking = await blockbookings.update(request.blockbooking);
    return res.status(200).json(mapToHttp(blockbooking));
  } catch (err) {
    if (/no patient with id/.test(err.message)) {
      return res.status(409).send();
    } 
    return res.status(404).send();
  }
};

exports.blockbookings_delete = async function(req, res) {
  try {
    await blockbookings.delete(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return res.status(404).send();
  }
};

function mapToHttp(blockbooking) {
  return {
    id: blockbooking.id,
    description: blockbooking.description,
    startTime: blockbooking.startTime.format('YYYY-MM-DDTHH:mm:ss\\Z'),
    duration: blockbooking.duration,
    recurrence: blockbooking.recurrence,
    dateEnd: blockbooking.dateEnd
  };
}