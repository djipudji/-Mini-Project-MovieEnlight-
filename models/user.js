const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    set: v => bcrypt.hashSync(v, 10)
  },
  image: {
    type: String,
    default: null,
    required: false,
    get: getImage
  }, 
  role: {
      type: String,
      default: "user",
      required: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  versionKey: false,
  toJSON: { getters: true }
});

function getImage(image) {
    return 'http://ec2-13-229-61-46.ap-southeast-1.compute.amazonaws.com:6969/img/' + image
}

UserSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = user = mongoose.model('user', UserSchema, 'user');