const mongoose = require('mongoose')
// async function main() {
//     await mongoose.connect(process.env.DATABASE_URL);
//     console.log("Success Connected MongoDB 🍬");
// }
// main().catch(err => console.log(err.message))

const connect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Success Connected MongoDB 🍬")
    } catch (err) {
        console.log(err.message);
    }
};

connect();

module.exports =  {mongoose, connect}