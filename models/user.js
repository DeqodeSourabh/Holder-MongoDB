const mongoose = require('mongoose');

const user =  mongoose.Schema({
  HolderAddress: {
    type: String
  },
  // HolderBalance: {
  //   type: String
  // }
});
module.exports = mongoose.model('users',user);