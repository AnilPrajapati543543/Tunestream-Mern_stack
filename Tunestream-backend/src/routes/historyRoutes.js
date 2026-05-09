import express from "express";
import { getAdminHistory } from "../controllers/historyController.js";
import protect from "../middleware/authMiddleware.js";

const historyRouter = express.Router();

historyRouter.get("/admin", protect, getAdminHistory);

export default historyRouter;
