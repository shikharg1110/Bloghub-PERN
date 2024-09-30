const Pool = require('pg').Pool;

const pool = new Pool( {
    user: "postgress",
    password: "xW0hlU1Wf9gBBCs9KNO5VPMTpWUHRLRA",
    host: "postgresql://postgress:xW0hlU1Wf9gBBCs9KNO5VPMTpWUHRLRA@dpg-crt48be8ii6s73ehujc0-a/bloghub_zfdi",
    port: 5432,
    database: "bloghub_zfdi"
})

module.exports = pool;


// const Pool = require('pg').Pool;

// const pool = new Pool( {
//     user: "postgres",
//     password: "12345",
//     host: "localhost",
//     port: 5432,
//     database: "bloghub"
// })

// module.exports = pool;