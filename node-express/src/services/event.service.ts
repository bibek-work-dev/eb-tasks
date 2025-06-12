import { Types } from "mongoose";
import EventModel from "../models/event.model";
import {
  ConflictError,
  InternalSeverError,
  NotFoundError,
} from "../utils/ErrorHandler";
import { typeCreateEventSchema } from "../utils/validations/eventsValidationSchema";

export const createEventService = async (
  userId: string,
  data: typeCreateEventSchema
) => {
  const createdEvent = await EventModel.create({
    ...data,
    eventCreatedBy: userId,
  });
  if (!createdEvent) throw new InternalSeverError();
  return createdEvent;
};

export const listEventsService = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const events = await EventModel.find()
    .sort({ startDate: 1 })
    .skip(skip)
    .limit(limit)
    .populate("eventCreatedBy", "name email")
    .populate("participants", "name email");

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
  const event = await EventModel.findById(eventId).populate(
    "participants",
    "name email"
  );

  if (!event) throw new NotFoundError("Event Not Found");

  const isAlreadyParticipant = event.participants.some(
    (participant) => participant._id.toString() === userId
  );

  if (isAlreadyParticipant)
    throw new ConflictError("You are already participating.");

  event.participants.push(new Types.ObjectId(userId));
  event.noOfParticipants = event.participants.length;
  await event.save();

  const updatedEvent = await EventModel.findById(eventId)
    .populate("participants", "name email")
    .populate("eventCreatedBy", "name email");

  return updatedEvent;
};

export const withDrawFromEventService = async (
  userId: string,
  eventId: string
) => {
  const event = await EventModel.findById(eventId).populate(
    "participants",
    "name email"
  );

  if (!event) throw new NotFoundError("Event Not Found");

  const isAlreadyParticipant = event.participants.some(
    (participant) => participant._id.toString() === userId
  );

  if (!isAlreadyParticipant)
    throw new ConflictError("You are not participating at first.");

  const updatedEvent = await EventModel.findByIdAndUpdate(
    eventId,
    { $pull: { participants: userId } },
    { new: true }
  ).populate("participants", "name email");

  return updatedEvent;
};
