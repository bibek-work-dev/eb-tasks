import EventModel from "../models/event.model";
import { NotFoundError } from "../utils/ErrorHandler";
import { typeCreateEventSchema } from "../utils/validations/eventsValidationSchema";

export const createEventService = async (
  userId: string,
  data: typeCreateEventSchema
) => {
  return await EventModel.create({ ...data, eventCreatedBy: userId });
};

export const listEventsService = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const events = await EventModel.find()
    .sort({ startDate: 1 })
    .skip(skip)
    .limit(limit)
    .populate("eventCreatedBy", "name email");
  const totalEvents = await EventModel.countDocuments();

  const totalPages = Math.ceil(totalEvents / limit);

  return {
    page,
    totalPages,
    totalEvents,
    events,
  };
};

export const participateEventService = async (
  userId: string,
  eventId: string
) => {
  const event = await EventModel.findByIdAndUpdate(
    eventId,
    { $addToSet: { participants: userId } },
    { new: true }
  ).populate("participants", "name email");

  if (!event) throw new NotFoundError("Event participation failed");
  return event;
};
