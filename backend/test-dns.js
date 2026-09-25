const dns = require('dns');
const net = require('net');
dns.lookup('ep-royal-shape-a111ye55-pooler.ap-southeast-1.aws.neon.tech', {family: 4}, (err, addr, fam) => {
    console.log('Resolved to:', addr);
    const s = net.createConnection({host: addr, port: 5432, family: 4}, () => {
        console.log('Connected!');
        s.destroy();
    });
    s.on('error', e => console.log('Error:', e.message));
    s.setTimeout(2000, () => {console.log('Timeout'); s.destroy();});
});
