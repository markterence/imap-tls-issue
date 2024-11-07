import Imap from 'imap';

export const imapConfig = {
  host: process.env.MAIL_SERVER_HOST,
  port: 993, // IMAP port
  secure: true,
  tls: {
    rejectUnauthorized: false, // This line allows self-signed certificates
    checkServerIdentity: () => null // This line bypasses hostname verification
  }
};

export const connectImap = async (email, password) => {
  try {
    return new Promise((resolve, reject) => {
      const imap = new Imap({ ...imapConfig, user: email, password });
      imap.once('ready', () => resolve(imap));
      imap.once('error', reject);
      imap.connect();
    });
  } catch (error) {
    console.error('Error connecting to IMAP server:', error);
    throw new Error('Error connecting to IMAP server');
  }
};