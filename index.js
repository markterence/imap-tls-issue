import "dotenv";

import * as sogoImap from './src/sogoImap.js';

const email = process.env.MAIL_USER;
const password = process.env.MAIL_PASSWORD;
console.log(process.env);
await sogoImap.connectImap(email, password);