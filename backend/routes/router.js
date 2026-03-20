import Router from "express";
import { addData, deleteData, getData, updateData } from "../controllers/controller.js";

let router = Router() 

router.get("/", getData)
router.post("/", addData)
router.put("/", updateData)
router.delete("/", deleteData)

export default router