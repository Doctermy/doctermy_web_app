import Router from "express";
const router = Router();
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";
import fileRouter from "./file.route.js";
import reviewRouter from "./review.route.js";


router.use("/api/v1/auth", authRouter);
router.use("/api/v1/users", userRouter);
router.use("/api/v1/file", fileRouter);
router.use("/api/v1/review", reviewRouter);


export default router;