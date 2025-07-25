// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// });

// module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String },
  password: { type: String, required: true },
  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
