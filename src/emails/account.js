const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: "hilksbill@gmail.com",
      subject: "WELCOME TO TASK MANAGER",
      text: `Hello ${name}, 
      Welcome to the app, Let us know how we can make your stay comfortable.`,
    })
    .then(() => {
      console.log("Email sent");
    })
    .catch((e) => {
      console.log("An Error occurred", e);
    });
};

const sendGoodbyeEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: "hilksbill@gmail.com",
      subject: "SORRY TO SEE YOU GO",
      text: `Goodbye ${name}, 
      We are sorry to see you leave the app, Kindly let us what we could've done to keep you with us.`,
    })
    .then(() => {
      console.log("Email sent");
    })
    .catch((e) => {
      console.log("An Error occurred", e);
    });
};

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail,
};
