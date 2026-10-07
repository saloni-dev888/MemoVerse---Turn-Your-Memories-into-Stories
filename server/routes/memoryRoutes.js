const router = require("express").Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const controller = require("../controllers/memoryController");

router.use(auth);

/*
  Get all memories
*/
router.get("/", controller.list);

/*
  Get one memory
*/
router.get("/:id", controller.getOne);

/*
  Create memory with up to 50 images
*/
router.post(
  "/",
  upload.array("images", 50),
  controller.create
);

/*
  Generate AI content
*/
router.post(
  "/:id/generate",
  controller.generate
);

/*
  Delete memory
*/
router.delete(
  "/:id",
  controller.remove
);

module.exports = router;