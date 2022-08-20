require('dotenv').config();
const { 
    SENDGRID_API_KEY, 
    SENDGRID_FROM_EMAIL
} = process.env;

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SENDGRID_API_KEY)

module.exports = async (to) => {
    const msg = {
        to,
        from: SENDGRID_FROM_EMAIL,
        subject: `Welcome ${ to }!`,
        text: 'and easy to do anywhere, even with Node.js',
        html: `
            <h4>Greetings ${ to }</h4>
            </li>
            <p>We are grateful that you have choosen our services and please feel free to contact us if you have any inquiry.</p>
            </li>
            <h4>Sincerely</h4>
            </li>
            <h4>Alkemy Backend Challenge</h4>
        `
    };
    
    sgMail.send(msg)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error)
        });
}