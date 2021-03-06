import { Request, Response, Router } from "express";
import { authToken, authUser, authAdmin } from "../middlewares/Auth";
import TicketRouter from "./Ticket";
import { loginUser } from "../controllers/AuthController";
import { newUser } from "../controllers/UserController";
import { newTicket } from "../controllers/TicketController";
import AdminRouter from "./Admin";
import {http_responder} from "../utils/http_response";

// Init router and path
const router = Router();

router.use("/health", (req: Request, res: Response) => {
	const message = "CSTS Server is up & Running";
	return http_responder.successResponse(res, [], message);
});

// Add sub-routes

router.post("/login", loginUser);
router.post("/register", newUser);
router.post("/ticket",authToken, authUser, newTicket)
router.use("/tickets", TicketRouter);
router.use("/admin", AdminRouter);

// Export the base-router
export default router;
