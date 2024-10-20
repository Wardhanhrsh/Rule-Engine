const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
  rule_id: {type:String, required: true, unique:true},
  rule: {type: Object, required:true}

});

module.exports = mongoose.model('Rule', RuleSchema)