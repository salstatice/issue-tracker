const mongoose = require("mongoose");
const {Schema} = mongoose;


// issue Schema
const issueSchema = new Schema({
  issue_title: {type: String, default: ''},
  issue_text: {type: String, default: ''},
  created_on: {type: Date, immutable: true, default: () => { return new Date() }},
  updated_on: {type: Date, default: () => { return new Date() }},
  created_by: {type: String, default: ''},
  assigned_to: {type: String, default: ''},
  open: {type: Boolean, default: true},
  status_text: {type: String, default: ''},
})

exports.issueSchema = issueSchema;