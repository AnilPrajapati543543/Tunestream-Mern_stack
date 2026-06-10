import express from "express";
import { getAdminHistory } from "../controllers/historyController.js";
import { logPlay, getAnalytics } from "../controllers/analyticsController.js";
import protect from "../middleware/authMiddleware.js";

const historyRouter = express.Router();

historyRouter.get("/admin", protect, getAdminHistory);
historyRouter.post("/log-play", protect, logPlay);
historyRouter.get("/analytics", protect, getAnalytics);

export default historyRouter;
