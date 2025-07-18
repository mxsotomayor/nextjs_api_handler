import { open } from 'lmdb';
const db = open({
    path: './.cache/lmdb', // .cache/ folder for storing LMDB files
    compression: true, // optional gzip-style compression
    encoding: 'json', // store/retrieve as JSON
});
export default db;
