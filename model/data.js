
const mongo = require('mongoose')
const Schema = mongo.Schema;
var dataSchema = new Schema({
    data: {
        type: String,
        required: false
    }
},
{
    timestamp: true
});

var Data = mongo.model('Data', dataSchema);

module.exports = Data;