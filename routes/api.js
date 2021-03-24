'use strict';

require('dotenv').config();
const mongoose = require("mongoose");
const issueSchema = require('../model.js').issueSchema;
const ObjectID = require('mongodb').ObjectID;


module.exports = function(app) {

  mongoose.connect(process.env.DB,{ useNewUrlParser: true, useUnifiedTopology: true }, function(error){
    if (error) {
      console.log(error);
    } else {
      console.log("connection successful");
    }
  });
  mongoose.set('useFindAndModify', false);

  app.route('/api/issues/:project')

    .get(function(req, res) {
      let condition = {
        issue_title : req.query.issue_title,
        issue_text : req.query.issue_text,
        created_from : (req.query.created_from ? new Date(req.query.created_from) : null),
        created_to : (req.query.created_to ? new Date(req.query.created_to) : null),
        created_by : req.query.created_by,
        assigned_to : req.query.assigned_to,
        open : req.query.open,
        status_text : req.query.status_text,
      }

      for (let key in condition) {
        if(condition[key] == undefined) {
          delete condition[key];
        }
      }


      let project = req.params.project;
      let Collection =  mongoose.model(project, issueSchema);
      Collection.find(condition, (err, data)=>{
        if (err) {
          console.log(err);
        } else {
          res.json(data);
        }
      })
    })

    .post(function(req, res) {
      let project = req.params.project;
      let issue = req.body;
      if ((!req.body.issue_title) || (!req.body.issue_text) || (!req.body.created_by)) {
        res.json({ error: 'required field(s) missing' })
      } else {
        let Collection =  mongoose.model(project, issueSchema);
        let issueItem = new Collection(issue);
        issueItem.save((err, data)=>{
          if (err) {
            console.log(err)
          } else {
            res.json(data)
          }
        })
      }  
    })

    .put(function(req, res) {
      let project = req.params.project;
      let id = req.body._id;
      let issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        open: req.body.open,
      };
   
      if (!id) {
        res.json({ error: 'missing _id' })
      } else if (!ObjectID.isValid(id)){
        res.json({ error: 'could not update', '_id': id })
      } else if (!issue.issue_title && !issue.issue_text && !issue.created_by && !issue.assigned_to && !issue.status_text && !issue.open) {
        res.json({ error: 'no update field(s) sent', '_id': id })
      } else {
        issue.updated_on = new Date();
        let Collection =  mongoose.model(project, issueSchema);
        Collection.updateOne({_id:new ObjectID(id)}, issue, (err, data)=>{
          if (err) {
            console.log(err)
            res.json({ error: 'could not update', '_id': id })
          }  
          if (data.n == 0) {
            res.json({ error: 'could not update', '_id': id })
          } else {
            res.json({ result: 'successfully updated', '_id': id })
          }
        })
      }
    })

    .delete(function(req, res) {
      let project = req.params.project;
      let id = req.body._id;
      if (!id) {
        res.json({ error: 'missing _id' })
      } else if (!ObjectID.isValid(id)) {
        res.json({ error: 'could not delete', '_id': id })
      } else {
        let Collection =  mongoose.model(project, issueSchema);
        Collection.deleteOne({_id:new ObjectID(id)}, (err, data)=>{
          if (err) {
            console.log(err)
            res.json({ error: 'could not delete', '_id': id })
          }
          if (data.n == 0) {
            res.json({ error: 'could not delete', '_id': id })
          } else {
            res.json({ result: 'successfully deleted', '_id': id })
          }
        })
      }
    });

};
