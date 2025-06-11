import { Request, Response, NextFunction } from "express";
import * as eventService from "../services/event.service";
import { typeCreateEventSchema } from "../utils/validations/eventsValidationSchema";

export const createEventController = async (
  req: Request<{}, {}, typeCreateEventSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const event = await eventService.createEventService(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Event created",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const listEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const events = await eventService.listEventsService(page, limit);
    res.status(200).json({
      success: true,
      message: "Events fetched",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const participateEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.userId;
    const updatedEvent = await eventService.participateEventService(
      userId,
      eventId
    );
    res.status(200).json({
      success: true,
      message: "Joined event",
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};
