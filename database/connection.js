const mongoose = require("mongoose");

const connect = async() => {
    try {

        const con = mongoose.connect(process.env.MONGODB_URI, {
            // useNewUrlParser: true,
            // useCreateIndex: true,
            useUnifiedTopology: true,
            // useFindAndModify: false
        });

        console.log(`MongoDB connected`);
    } catch(err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connect;