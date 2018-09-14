const express = require('express');
const router = express.Router();

const blockbookings_controller = require('../controllers/blockbookingsController');

/**
 * @api { get } /api/blockbookings/:date Retrieve list of blockbookings on a date 
 * 
 * @apiParam { string } date Date if format YYYY-MM-DD
 * @apiParam { string } tz Timezone is format Region/Zone according to tz database
 *     Optional.  Defaults to Etc/UTC if not present.
 *
 * @apiSuccess { blockbookings: [] } blockbookings Array of blockbooking objects
 * @apiExample Retrieve all blockbookings on Aug 6, 2018 MDT
 *     http://localhost:3000/api/blockbookings/2018-08-06?tz=America/Edmonton
 */
router.get('/:date(\\d{4}-\\d{2}-\\d{2})/', blockbookings_controller.blockbookings_showByDate);

/**
 * @api { get } /api/blockbookings/:id Retrieve specific blockbooking by id
 * 
 * @apiParam { string } id Apointment's unique ID 
 */
router.get('/:id', blockbookings_controller.blockbookings_showById);

/**
 * @api { put } /api/blockbookings/:id Update a specific blockbooking by id
 *
 * @apiParam { string } id Blockbooking's unique ID 
 */
router.put('/:id', blockbookings_controller.blockbookings_update);

/**
 * @api { delete } /api/blockbookings/:date Delete specific blockbooking by id
 * 
 * @apiParam { string } id Apointment's unique ID 
 */
router.delete('/:id', blockbookings_controller.blockbookings_delete);

/**
 * @api { get } /api/blockbookings Retrieve list of all blockbookings
 * 
 * @apiSuccess { blockbookings: [] } blockbookings Array of blockbooking objects
 */
router.get('/', blockbookings_controller.blockbookings_list);

/**
 * @api { post } /api/blockbookings Create a new blockbooking 
 * @apiParamExample { json } Request-Example:
 *     {
 *         "patientId": "7",
 *         "startTime": "2018-08-06T18:00:00Z",
 *         "duration": 30 
 *     }
 * @apiSuccessExample { json } Success-Response:
 *     {
 *         "id": "4",
 *         "patientId": "7",
 *         "firstName": "Marjorie",
 *         "lastName": "Brown",
 *         "startTime": "2018-08-06T18:00:00Z",
 *         "duration": 30 
 *     }
 */
router.post('/', blockbookings_controller.blockbookings_create);

module.exports = router;