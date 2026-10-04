const router = require("express").Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const controller = require("../controllers/memoryController");

router.use(auth);
router.get("/", controller.list);
router.get("/:id", controller.getOne);
router.post("/", upload.array("images", 8), controller.create);
router.post("/:id/generate", controller.generate);
router.delete("/:id", controller.remove);

module.exports = router;
