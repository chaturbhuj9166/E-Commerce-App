import { Router } from "express";
import { checkForlogin } from "../middlewares/MiddlewaresAuth.js";

const checkRouter = Router();

// Return login status for frontend auth checks
checkRouter.get("/login", checkForlogin);

export default checkRouter;
