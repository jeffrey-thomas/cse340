const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")


router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventoryDetailView))

/*********************
 * MANAGEMENT ROUTES
 ********************/

router.get("/", utilities.handleErrors(invController.buildManagementView))

//Add Classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClass))
router.post(
    "/add-classification",
    invValidate.addClassRules(),
    invValidate.checkAddClassData,
    utilities.handleErrors(invController.addClassification)
)

//Add Vehicle
router.get("/add-vehicle", utilities.handleErrors(invController.buildAddVehicle))
router.post(
    "/add-vehicle",
    invValidate.addVehicleRules(),
    invValidate.checkVehicleData,
    utilities.handleErrors(invController.addVehicle)
)

module.exports = router