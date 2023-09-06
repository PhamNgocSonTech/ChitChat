const mongoose = require('mongoose')
const {logger} = require('../config/logModule')
// async function main() {
//     await mongoose.connect(process.env.DATABASE_URL);
//     console.log("Success Connected MongoDB 🍬");
// }
// main().catch(err => console.log(err.message))

const connect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        if(process.env.NODE_ENV !== 'test') logger.info("[LOG=DB] Success Connected MongoDB🍬")
        // console.log("Success Connected MongoDB 🍬")
    } catch (err) {
        logger.error(err)
        // console.log(err.message);
    }
};

// connect();

module.exports =  {mongoose, connect}