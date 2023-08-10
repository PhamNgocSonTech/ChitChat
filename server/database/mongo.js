const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
const connectDB = async () => {
   await mongoose.connect(process.env.DATABASE_URL,  (err) => {
            if(err) {
                console.log(err.message);
                return;
            }
            console.log("Success Connected MongoDB 🍬");
        }
    )
}

// connectDB();
module.exports =  {connectDB, mongoose}