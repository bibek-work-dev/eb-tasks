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
