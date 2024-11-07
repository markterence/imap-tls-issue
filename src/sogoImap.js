import Imap from 'imap';

export const imapConfig = {
  host: process.env.MAIL_SERVER_HOST,
  port: 993, // IMAP port
  secure: true,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
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

export const fetchEmails = async (folder = 'INBOX', imap, page = 1, limit = 10, searchQuery = []) => {
  return new Promise((resolve, reject) => {
    imap.openBox(folder.replace('folder', ''), true, (err, box) => {
      if (err) return reject(err);

      const emails = [];

      const searchCriteria = searchQuery.length ? searchQuery : ['ALL'];

      // Perform search based on the searchQuery
      imap.search(searchCriteria, (err, results) => {
        if (err) return reject(err);

        const totalMessages = results.length;
        const start = (page - 1) * limit;
        const end = Math.min(start + limit, totalMessages);
        const fetchRange = results.reverse().slice(start, end);

        if (!fetchRange.length) {
          return resolve({
            emails,
            currentPage: page,
            totalMessages,
            totalPages: Math.ceil(totalMessages / limit)
          });
        }

        const f = imap.fetch(fetchRange, {
          bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
          struct: true,
          uid: true
        });

        f.on('message', (msg, seqno) => {
          let mailObject = {};

          msg.on('attributes', (attrs) => {
            mailObject.uid = attrs.uid;
            mailObject.seen = attrs.flags.includes('\\Seen');
          });

          msg.on('body', (stream) => {
            let buffer = '';
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
            stream.once('end', () => {
              mailObject.headers = Imap.parseHeader(buffer);
              emails.push(mailObject);
            });
          });
        });

        f.once('error', (err) => {
          reject(err);
        });

        f.once('end', () => {
          resolve({
            emails: emails.reverse(),
            currentPage: page,
            totalMessages,
            totalPages: Math.ceil(totalMessages / limit)
          });
        });
      });
    });
  });
};