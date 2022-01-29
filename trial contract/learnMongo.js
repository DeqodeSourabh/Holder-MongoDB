const connectDB = require('../models/connection');
const User = require('../models/user')

connectDB();
 async function learnMongo(){
    let userModel = new User({
        HolderAddress: "er",
        tokenID: "123",
        contractAddress: "fsdferwer"
    })
    userModel.save().then(() => {
        console.log('inserted')
    })
    // .catch((error) =>{
    //     console.log(error);
    // })
    // const result =await User.find({
    //     HolderAddress: '1034260045661988285644694030867800649772743490325',
    // })
    // console.log(result);
    // result1 = await User.findOne({ HolderAddress: '10342600456619882856446940308678006497727434903252' }).exec();
    // if (result1 == null){
    //     console.log('not exist');
    // }
    
}
learnMongo();