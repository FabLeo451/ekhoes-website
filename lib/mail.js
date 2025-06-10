import nodemailer from 'nodemailer';

async function sendLocal(to, subject, html) {

	let transporter = nodemailer.createTransport({
		host: 'localhost',
		port: 1025,
		secure: false, // MailDev doesn't use TLS
	});

	try {
		await transporter.sendMail({
			from: '"Ekhoes" <no-reply@ekhoes.com>',
			to,
			subject,
			html,
		});

		return true;

	} catch (error) {
		console.log('[sign-in] ', error)
		return false;
	}
}

async function send(to, subject, html) {
	sendLocal(to, subject, html)
}

export { send };
