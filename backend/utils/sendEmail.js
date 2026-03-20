import sgMail from "@sendgrid/mail";

const FROM_SENDER = {
  email: process.env.MY_SENDGRID_EMAIL,
  name: "Chaturbhuj Joshi",
};

function ensureEmailConfig() {
  if (!process.env.MY_SENDGRID_API_KEY) {
    throw new Error("SendGrid API key is missing");
  }

  if (!FROM_SENDER.email) {
    throw new Error("SendGrid sender email is missing");
  }

  sgMail.setApiKey(process.env.MY_SENDGRID_API_KEY);
}

async function sendEmail(message) {
  ensureEmailConfig();
  await sgMail.send(message);
}

export const sendOtpEmail = async (email, otp) => {
  await sendEmail({
    to: email,
    from: FROM_SENDER,
    subject: "Verify your Email - OTP",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    html: `
      <h2>Hello</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for <b>5 minutes</b>.</p>
      <br/>
      <p>Chaturbhuj Joshi</p>
    `,
  });
};

export const sendWelcomeEmail = async (email, name) => {
  await sendEmail({
    to: email,
    from: FROM_SENDER,
    subject: "Welcome",
    text: `Welcome ${name}. Your email has been verified successfully.`,
    html: `
      <h2>Welcome ${name}</h2>
      <p>Your email has been verified successfully.</p>
      <br/>
      <p>Thanks & Regards,</p>
      <p><b>Chaturbhuj Joshi</b></p>
    `,
  });
};
