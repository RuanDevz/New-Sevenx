const nodemailer = require('nodemailer');

const sendConfirmationEmail = async (email) => {
let transporter = nodemailer.createTransport({
  host:  process.env.HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


  // Email content
const mailOptions = {
  from: '"VIP Service" <your-email@example.com>',
  to: email,
  subject: 'VIP Membership Confirmation!',
  text: 'Congratulations! You are now a VIP member.',
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #4B0082; color: #FFFFFF; padding: 25px; border-radius: 8px; text-align: center;">
      <h1 style="margin-bottom: 20px;">🎉 Welcome to VIP Access 🎉</h1>
      <p style="margin-bottom: 20px;">Hello,</p>
      <p style="margin-bottom: 20px;">
        We are excited to inform you that your payment was <b>successful</b> and you are now a <span style="color: #FFD700;">VIP member</span>!
      </p>
      <p style="margin-bottom: 20px;">
        Enjoy exclusive content, ad-free experiences, and much more.
      </p>
      <p style="margin-top: 20px;">
        Thank you for being a part of our community!
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #DDD;">
      <p style="font-size: 14px; color: #DDD;">
        Best regards,<br/> Your Service Team
      </p>
    </div>
  `,
};


  await transporter.sendMail(mailOptions);
};

const sendVipRequestEmail = async ({ type, userEmail, userName, modelName, contentLink, rejectionReason, requestId }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {};

  if (type === 'submitted') {
    mailOptions = {
      from: '"VIP Request Service" <your-email@example.com>',
      to: userEmail,
      subject: 'VIP Request Submitted Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #4B0082; color: #FFFFFF; padding: 25px; border-radius: 8px;">
          <h1 style="margin-bottom: 20px;">✨ Request Submitted ✨</h1>
          <p style="margin-bottom: 20px;">Hello ${userName},</p>
          <p style="margin-bottom: 20px;">
            Your VIP content request for <b>${modelName}</b> has been successfully submitted!
          </p>
          <p style="margin-bottom: 20px;">
            Request ID: <b>#${requestId}</b>
          </p>
          <p style="margin-bottom: 20px;">
            Our team will review your request and get back to you soon.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #DDD;">
          <p style="font-size: 14px; color: #DDD;">
            Best regards,<br/> VIP Service Team
          </p>
        </div>
      `,
    };
  } else if (type === 'approved') {
    mailOptions = {
      from: '"VIP Request Service" <your-email@example.com>',
      to: userEmail,
      subject: '🎉 Your VIP Request Has Been Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #4B0082; color: #FFFFFF; padding: 25px; border-radius: 8px;">
          <h1 style="margin-bottom: 20px;">🎉 Request Approved! 🎉</h1>
          <p style="margin-bottom: 20px;">Hello ${userName},</p>
          <p style="margin-bottom: 20px;">
            Great news! Your VIP content request for <b>${modelName}</b> has been approved!
          </p>
          <p style="margin-bottom: 20px;">
            Request ID: <b>#${requestId}</b>
          </p>
          <p style="margin-bottom: 20px;">
            You can access your content here:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${contentLink}" style="background-color: #FFD700; color: #4B0082; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              View Content
            </a>
          </div>
          <p style="margin-top: 20px;">
            Thank you for being a VIP member!
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #DDD;">
          <p style="font-size: 14px; color: #DDD;">
            Best regards,<br/> VIP Service Team
          </p>
        </div>
      `,
    };
  } else if (type === 'rejected') {
    mailOptions = {
      from: '"VIP Request Service" <your-email@example.com>',
      to: userEmail,
      subject: 'Update on Your VIP Request',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #4B0082; color: #FFFFFF; padding: 25px; border-radius: 8px;">
          <h1 style="margin-bottom: 20px;">Request Update</h1>
          <p style="margin-bottom: 20px;">Hello ${userName},</p>
          <p style="margin-bottom: 20px;">
            We've reviewed your VIP content request for <b>${modelName}</b>.
          </p>
          <p style="margin-bottom: 20px;">
            Request ID: <b>#${requestId}</b>
          </p>
          <p style="margin-bottom: 20px;">
            Unfortunately, we are unable to fulfill this request at this time.
          </p>
          ${rejectionReason ? `
          <div style="background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><b>Reason:</b> ${rejectionReason}</p>
          </div>
          ` : ''}
          <p style="margin-top: 20px;">
            You can submit a new request anytime. If you have questions, please contact our support team.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #DDD;">
          <p style="font-size: 14px; color: #DDD;">
            Best regards,<br/> VIP Service Team
          </p>
        </div>
      `,
    };
  }

  await transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail, sendVipRequestEmail };
