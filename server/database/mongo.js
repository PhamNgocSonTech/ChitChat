const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
async function main() {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Success Connected MongoDB 🍬");
}
main().catch(err => console.log(err.message) )
// connectDB();
module.exports =  {mongoose}