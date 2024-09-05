import { Router } from "express";
const router = Router();
import UserController from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { updateUserSchema } from "../schemas/user.schema.js";
import { USER_TYPES } from "../utils/user.js";


router.get(
  "/",
  authenticate([USER_TYPES.SUPERADMIN, USER_TYPES.ADMIN]),
  UserController.findUsers
);

router.get("/:id", authenticate([]), UserController.findUser);

router.patch(
  "/update/:id",
  authenticate([]),
  validate(updateUserSchema),
  UserController.updateUser
);

router.delete("/delete/:id", authenticate([]), UserController.delUser);

export default router;