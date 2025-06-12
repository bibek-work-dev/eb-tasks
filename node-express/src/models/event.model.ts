import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  participants: mongoose.Types.ObjectId[];
  eventCreatedBy: mongoose.Types.ObjectId;
  noOfParticipants: number;
  emailRemainderSent: boolean;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    eventCreatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    noOfParticipants: { type: Number, default: 0 },
    emailRemainderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const EventModel = mongoose.model<IEvent>("Event", eventSchema);
export default EventModel;
