const nodemailer = require('nodemailer');

exports.sendHighQualityLeadEmail = async (lead) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_SENT_TO, // Replace with your own or dynamic email
    subject: `🔥 High Quality Lead: ${lead.name}`,
    text: `
New High Quality Lead:

Name: ${lead.name}
Email: ${lead.email}
Company Size: ${lead.company_size}
Job Title: ${lead.job_title}
Website: ${lead.website}
Message: ${lead.message}
Score: ${lead.score}
    `,
  };

  await transporter.sendMail(mailOptions);
};
