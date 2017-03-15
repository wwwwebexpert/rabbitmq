var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

var messageSchema = new Schema({
    value   : { type: String, required: true }
},{
  timestamps: true
});

messageSchema.set('toObject', { virtuals: true });
messageSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Message', messageSchema);