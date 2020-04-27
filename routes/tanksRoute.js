const express = require('express');
const router = express.Router();
const tankController = require('../controllers/tankController');

// router
//   .route('/tank/:model/:country')
//   .get(tankController.getTankInfo)
//   .delete(tankController.deleteTank);

router
  .route('/tank/')
  .get(tankController.getTankInfo) //Adquirir informação de um tanque especifico ---------
  .delete(tankController.deleteTank); //Remover informação de um tanque especifico ---------

router
  .route('/newtank')
  .get(tankController.checkBody_tank, tankController.insertNewTank); //Adcionar um novo tanque ---------

router
  .route('/tankMap')
  .get(tankController.getTankMapInfo) //Adquirir informação do mapeamento de um tanque ---------
  .delete(tankController.deleteTankMap); //Remover a informação de um tanque

router
  .route('/tankMap/new')
  .post(tankController.checkBody_tank, tankController.insertTankMap); //Adcionar um novo mapeamento de um tanque ---------

router.route('/').get(tankController.getAllTanksData); //Adquirir a informação de todos os tanques ---------

module.exports = router;
