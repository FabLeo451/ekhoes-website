import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

function SignUpTemplate(name, user_name, token) {

	const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/confirm?token=${token}`;

	return (
		<div>
			<p>Hello, {name}.</p>
			<p>
				Click on the link below to complete the registration process:<br />
				<a href={url}>Confirm</a>
			</p>
		</div>
	);
}

async function sendSignUp(to, subject, name, userName, token) {
	try {
		const { data, error } = await resend.emails.send({
			from: 'Ekhoes <no-reply@updates.ekhoes.com>',
			to: [to],
			subject: subject,
			react: SignUpTemplate(name, userName, token),
		});

		if (error) {
			console.error('Email sending error:', error);
			return false;
		}

		return true;
	} catch (err) {
		console.error('Unexpected error in sendSignUp:', err);
		return false;
	}
}

export { sendLocal, sendSignUp };
