const express = require('express');
const router = express.Router();
const tankController = require('../controllers/tankController');

router
  .route('/tank/:model/:country')
  .get(tankController.getTankInfo)
  .delete(tankController.deleteTank);

router.route('/newtank').post(tankController.insertNewTank);

router
  .route('/tankMap/:model/:country')
  .get(tankController.getTankMapInfo)
  .delete(tankController.deleteTankMap);

router.route('/tankMap/new').post(tankController.insertTankMap);

router.route('/').get(tankController.getAllTanksData);

module.exports = router;
