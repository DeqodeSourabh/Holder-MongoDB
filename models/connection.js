const mongoose = require('mongoose');

const URI ="mongodb+srv://office:sourabh@cluster0.il3sa.mongodb.net/learnMongo?retryWrites=true&w=majority";

const connectDB = ()=>{
        mongoose.connect(URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
    }).then(() => console.log("Database connected!"))
    .catch(err => console.log(err));
}
module.exports = connectDB;