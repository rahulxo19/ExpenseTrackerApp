const Sib = require('sib-api-v3-sdk')

const client = Sib.ApiClient.instance;

const apikey = client.authentications['api-key'];
apikey.apiKey = process.env.BLUE_API;

const apiInstance = new Sib.TransactionalEmailsApi();

const sender = { 
    email : 'ghosttown0kill@gmail.com',
    name : 'Ghosty'
}

module.exports.forgotPassword = async (req, res) => {
    try{
        const { email } = req.body;
        console.log(email);
        res.send(email);

        apiInstance.sendTransacEmail({
            sender,
            to: [{ email }],
            subject: "first time sending mail using api",
            textContent:"this place will be used for sending forgotten password",
            htmlContent:`<h1>TWITCH</h1>
            <a href="https://www.twitch.tv/aceu">VISIT</a>`,
            params: {
                role: 'Frontend',
            },
        })
        .then(console.log)
        .catch(console.log);

    } catch (err) {
        res.send(err.message);
    }
}
