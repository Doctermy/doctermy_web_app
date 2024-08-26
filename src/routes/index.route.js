import Router from "express";
const router = Router();
import hospitalRouter from "./hospital.route.js"


router.use("/api/v1/hospital", hospitalRouter);


export default router;