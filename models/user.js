const mongoose = require('mongoose');

const user =  mongoose.Schema({
  HolderAddress: {
    type: String
  }
});
module.exports = mongoose.model('users3',user);