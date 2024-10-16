const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// Load environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
const SENDER_EMAIL = "dev@referrd.com.au"; // Use the email address that you have verified with SendGrid

sgMail.setApiKey(SENDGRID_API_KEY);

// Function to send an email using SendGrid
async function sendTestEmail() {
  const msg = {
    to: "dev@referrd.com.au", // Change to your recipient's email
    from: SENDER_EMAIL, // Use your verified sender email
    subject: "Test Email from SendGrid",
    text: "This is a test email sent via SendGrid API!",
    html: "<strong>This is a test email sent via SendGrid API!</strong>",
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}

// Run the email sending function
sendTestEmail();
