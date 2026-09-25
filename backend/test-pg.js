const pg = require('pg');
const c = new pg.Client({
    host: 'ep-royal-shape-a111ye55-pooler.ap-southeast-1.aws.neon.tech',
    port: 5432,
    database: 'verceldb',
    user: 'default',
    password: 'GOX0lW2BopLm',
    family: 4,
    ssl: { rejectUnauthorized: false }
});
c.connect().then(r => {
    console.log('OK!');
    c.end();
}).catch(e => {
    console.log('ERR:', e.message);
    c.end();
});
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 5000);
