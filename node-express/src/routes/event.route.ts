import express from "express";
import requireAuth from "../middlewares/requireAuth";
import * as eventController from "../controllers/event.controller";
import { zodValidate } from "../middlewares/zodValidation";
import { createEventSchema } from "../utils/validations/eventsValidationSchema";

const eventRoutes = express.Router();

eventRoutes.post(
  "/create",
  zodValidate(createEventSchema),
  requireAuth,
  eventController.createEventController
);
eventRoutes.get("/", eventController.listEventsController);
eventRoutes.patch(
  "/participate/:eventId",
  requireAuth,
  eventController.participateEventController
);

export default eventRoutes;
