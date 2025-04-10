const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")
const revValidate = require("../utilities/review-validation")


router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventoryDetailView))

/*********************
 * MANAGEMENT ROUTES
 ********************/

router.get("/", utilities.checkEmployment, utilities.handleErrors(invController.buildManagementView))

//Add Classification
router.get("/add-classification", utilities.checkEmployment, utilities.handleErrors(invController.buildAddClass))
router.post(
    "/add-classification",
    invValidate.addClassRules(),
    invValidate.checkAddClassData,
    utilities.handleErrors(invController.addClassification)
)

//Add Vehicle
router.get("/add-vehicle", utilities.checkEmployment, utilities.handleErrors(invController.buildAddVehicle))
router.post(
    "/add-vehicle",
    invValidate.addVehicleRules(),
    invValidate.checkVehicleData,
    utilities.handleErrors(invController.addVehicle)
)

//Modify Vehicle
router.get("/edit/:inv_id", utilities.checkEmployment, utilities.handleErrors(invController.buildModifyVehicle))
router.post(
    "/edit-vehicle/",
    invValidate.addVehicleRules(),
    invValidate.checkUpdateData, 
    utilities.handleErrors(invController.updateVehicle)
)

//Delete Vehicle
router.get("/delete/:inv_id", utilities.checkEmployment, utilities.handleErrors(invController.buildConfirmDelete))
router.post(
    "/delete",
    utilities.handleErrors(invController.deleteVehicle)
)

//Get vehicles by category
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON))

module.exports = router