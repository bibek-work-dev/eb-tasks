import nodemailer from "nodemailer";

import cron from "node-cron";
import EventModel from "../models/event.model";
import { sendEventRemainderEmail } from "../utils/emails/sendEmail";

export const emailJob = () => {
  console.log("starting the email job");

  cron.schedule("*/10 * * * * *", async () => {
    console.log("cron-jobs is running");
    const now = new Date();

    console.log("now ", now);

    const thirtyMinsLater = new Date(now.getTime() + 30 * 60 * 1000);

    const events = await EventModel.find({
      startDate: {
        $gte: now,
        $lte: thirtyMinsLater,
      },
      emailRemainderSent: false,
    }).populate("participants", "email");

    console.log("events", events);

    for (const event of events) {
      sendEventRemainderEmail(event);
      event.emailRemainderSent = true;
      event.save();
    }
  });
};
