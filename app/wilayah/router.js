const wilayahController = require("./controller");
const router = require('express').Router()

router.get("/wilayah/provinsi",wilayahController.getProvinsi);
router.get("/wilayah/kabupaten",wilayahController.getKabupaten);
router.get("/wilayah/kecamatan",wilayahController.getKecamatan);
router.get("/wilayah/desa",wilayahController.getDesa);

module.exports = router;

