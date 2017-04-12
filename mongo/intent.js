var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  sentence: String,
  intent: {
      intent: String,
      entities: Schema.Types.Mixed
  }
}, {strict: false});

var CorrectIntent = mongoose.model('correctIntent', schema);
var IncorrectIntent = mongoose.model('incorrectIntent', schema);

module.exports = {
  CorrectIntent,
  IncorrectIntent
};