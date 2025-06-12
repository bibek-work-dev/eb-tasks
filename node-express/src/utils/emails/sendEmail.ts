import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter;

transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  service: "gmail",
  secure: false, // true for 465, false for other ports
  auth: {
    user: "bibek.koirala.ebpearls@gmail.com",
    pass: "lydb tivw hgjd lrnv",
  },
});

export const sendVerficationEmail = async (
  email: string,
  token: string
): Promise<any> => {
  //   const trans = await setupEmail();
  // const otp = getRandomNumber();
  const info = await transporter.sendMail({
    from: "bibek.koirala.ebpearls@gmail.com",
    to: email,
    subject: "Email Verification - Your OTP Code",
    text: `Hello,\n\nPlease verify your email address using the following code:\n\nOTP: ${token}\n\nIf you didn't request this, you can ignore this email.\n\nThanks!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Email Verification</h2>
        <p>Hello,</p>
        <p>Please verify your email address using the following code:</p>
        <h3 style="color: #2e6da4;">${token}</h3>
        <p>If you didn't request this, you can ignore this email.</p>
        <p>Thanks!</p>
      </div>
    `,
  });

  console.log("Message sent:", info);
};

export const sendResetPasswordEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const info = await transporter.sendMail({
    from: '"Bibek - Task App" <bibek.koirala.ebpearls@gmail.com>',
    to: email,
    subject: "Reset Your Password",
    text: `Hello,\n\nYou requested a password reset. Please use the following code to reset your password:\n\nOTP: ${token}\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Password Reset</h2>
        <p>Hello,</p>
        <p>You requested to reset your password. Use the code below:</p>
        <h3 style="color: #d9534f;">${token}</h3>
        <p>This code is valid for a limited time.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });

  console.log("Reset password email sent:", nodemailer.getTestMessageUrl(info));
};

export const sendEventRemainderEmail = async (event: any): Promise<void> => {
  const { title, startDate } = event;
  console.log("events", event);
  const emails = event.participants.map((each: any) => each.email);
  console.log("emails", emails);
  const mailOptions = {
    from: '"Bibek - Event Reminder" <bibek.koirala.ebpearls@gmail.com>',
    to: emails.join(", "),
    subject: `Reminder: Your event "${title}" starts soon!`,
    text: `Hello,

This is a reminder that your event "${title}" is scheduled to start at ${startDate.toLocaleString()}.

See you soon!
- Task App Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Event Reminder</h2>
        <p>Hello,</p>
        <p>This is a reminder that your event <strong>${title}</strong> is starting at:</p>
        <p><strong>${startDate.toLocaleString()}</strong></p>
        <p>See you there!</p>
        <p>- Task App Team</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Event reminder email sent:", info.messageId);
};
