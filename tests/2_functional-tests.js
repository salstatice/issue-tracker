const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let testIssueId;

suite('Functional Tests', function() {
  
  suite('Routing Tests', function() {
    
    suite('POST /api/issues/{project} => create issue', function() {
      
      test('Create an issue with every field', function (done) {
        chai
          .request(server)
          .post('/api/issues/alpaca')
          .send({
            issue_title:'Need an alpaca',
            issue_text: "I can't find my alpaca",
            created_by: 'baby shark',
            assigned_to: 'mommy shark',
            status_text: 'VERY IMPORTANT!!'
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.issue_title, 'Need an alpaca');
            assert.equal(res.body.issue_text, "I can't find my alpaca");
            assert.equal(res.body.created_by, 'baby shark');
            assert.equal(res.body.assigned_to, 'mommy shark');
            assert.equal(res.body.status_text, 'VERY IMPORTANT!!');
            assert.isNotNull(res.body.created_on);
            assert.isNotNull(res.body.updated_on);
            assert.isTrue(res.body.open);
            assert.isNotNull(res.body._id);
            done();
          });
      });
      
      test('Create an issue with only required fields', function(done) {
        chai
          .request(server)
          .post('/api/issues/alpaca')
          .send({
            issue_title:'Looking for baby alpaca',
            issue_text: "baby alpaca ran off in the afternoon",
            created_by: 'big alpaca',
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.issue_title, 'Looking for baby alpaca');
            assert.equal(res.body.issue_text, "baby alpaca ran off in the afternoon");
            assert.equal(res.body.created_by, 'big alpaca');
            assert.equal(res.body.assigned_to, '');
            assert.equal(res.body.status_text, '');
            assert.isNotNull(res.body.created_on);
            assert.isNotNull(res.body.updated_on);
            assert.isTrue(res.body.open);
            assert.isNotNull(res.body._id);
            testIssueId = res.body._id;
            done();
          });
      })

      test('Create an issue with missing required fields', function(done) {
        chai
          .request(server)
          .post('/api/issues/alpaca')
          .send({
            issue_title:'Looking for baby alpaca',
            issue_text: "baby alpaca ran off in the afternoon",
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'required field(s) missing');
            done();
          });
      })

    });

    suite('GET /api/issues/{project} => view issue', function() {
      test('View issues on a project: ', function(done) {
        chai
          .request(server)
          .get('/api/issues/alpaca')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isArray(res.body);
            done();
          });
      })

      test('View issues on a project with one filter', function(done) {
        chai.request(server)
          .get('/api/issues/alpaca')
          .query({ open: 'false' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isArray(res.body);
            done();
          });
      })

      test('View issues on a project with multiple filters', function(done) {
        chai.request(server)
          .get('/api/issues/alpaca')
          .query({ open: 'false', created_by: 'mommy shark' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isArray(res.body);
            done();
          });
      })
    });

    suite('PUT /api/issues/{project} => update issue', function() {
      test('Update one field on an issue: ', function(done) {
        chai
          .request(server)
          .put('/api/issues/alpaca')
          .send({
            _id: testIssueId,
            issue_title:'Looking for baby alpacaOne and alpacaTwo',
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, testIssueId);
            done();
          });
      })

      test('Update multiple fields on an issue: ', function(done) {
        chai
          .request(server)
          .put('/api/issues/alpaca')
          .send({
            _id: testIssueId,
            issue_title:'Looking for baby alpacaOne and alpacaTwo',
            issue_text: 'baby alpacaOne ran off in the afternoon, alpacaTwo ran off in the evening'
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, testIssueId);
            done();
          });
      })

      test('Update an issue with missing _id', function(done) {
        chai
          .request(server)
          .put('/api/issues/alpaca')
          .send({
            issue_title:'alpaca',
            issue_text: 'alpaca'
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'missing _id');
            done();
          });
      })

      test('Update an issue with no fields to update', function(done) {
        chai
          .request(server)
          .put('/api/issues/alpaca')
          .send({ _id: testIssueId })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'no update field(s) sent');
            assert.equal(res.body._id, testIssueId);
            done();
          });
      })

      test('Update an issue with an invalid _id', function(done) {
        chai
          .request(server)
          .put('/api/issues/alpaca')
          .send({ 
            _id: 'InvalidID',
            issue_title:'Runaway alpaca',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'could not update');
            assert.equal(res.body._id, 'InvalidID');
            done();
          });
      })
    });

    suite('DELETE /api/issues/{project} => delete issue', function() {
      test('Delete an issue', function(done) {
        chai
          .request(server)
          .delete('/api/issues/alpaca')
          .send({ _id: testIssueId })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.result, 'successfully deleted');
            assert.equal(res.body._id, testIssueId);
            done();
          });
      })

      test('Delete an issue with an invalid _id', function(done) {
        chai
          .request(server)
          .delete('/api/issues/alpaca')
          .send({ _id: 'InvalidID' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'could not delete');
            assert.equal(res.body._id, 'InvalidID');
            done();
          });
      })

      test('Delete an issue with missing _id', function(done) {
        chai
          .request(server)
          .delete('/api/issues/alpaca')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'missing _id');
            done();
          });
      })
    });

  });
});
