const express = require('express');
const router = express.Router();
const tankController = require('../controllers/tankController');

// router
//   .route('/tank/:model/:country')
//   .get(tankController.getTankInfo)
//   .delete(tankController.deleteTank);

router
  .route('/tank/')
  .get(tankController.getTankInfo)
  .delete(tankController.deleteTank);

router
  .route('/newtank')
  .post(tankController.checkBody_tank, tankController.insertNewTank);

router
  .route('/tankMap')
  .get(tankController.getTankMapInfo)
  .delete(tankController.deleteTankMap);

router
  .route('/tankMap/new')
  .post(tankController.checkBody_tank, tankController.insertTankMap);

router.route('/').get(tankController.getAllTanksData);

module.exports = router;
