const mongoose = require('mongoose');

const user =  mongoose.Schema({
  HolderAddress: {
    type: String
  },
  tokenID:{
    type: String
  },
  contractAddress:{
    type: String
  },
  Transection_Hash:{
    type: String
  }
});
module.exports= User = mongoose.model('users6',user);