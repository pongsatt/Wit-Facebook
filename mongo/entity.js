var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  type: String,
  value: String
});

var model = mongoose.model('entity', schema);

module.exports = model;