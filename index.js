import 'dotenv/config'

import * as sogoImap from './src/sogoImap.js';

const email = process.env.MAIL_USER;
const password = process.env.MAIL_PASSWORD;
console.log(process.env);
const imap = await sogoImap.connectImap(email, password);
const inbox = await sogoImap.fetchEmails('INBOX', imap);
console.log(inbox);