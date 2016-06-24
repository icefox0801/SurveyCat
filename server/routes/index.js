'use strict';

var path = require('path');

var fs =  require('graceful-fs');
var DataStore = require('nedb');
var YAML = require('yamljs');
var express = require('express');
var router = express.Router();

/* GET config page. */
router.get('/', function (req, res) {
  var questions = [];
  var questionsFile = path.join(req.surveycat.dir, 'questions.yml');

  if (fs.existsSync(questionsFile)) {
    questions = YAML.load(questionsFile);
  }

  res.render('index', {
    surveycat: req.surveycat,
    questionList: questions
  });

});

/* POST config page */
router.post('/', function (req, res) {
  var db = new DataStore({
    filename: path.join(req.surveycat.dir, 'datafile'),
    autoload: true
  });
  var questions = JSON.parse(req.body.questions);
  db.insert({
    answers: questions,
    createAt: new Date()
  }, function (err, newDocs) {

    if (err) {
      throw err;
    }

    res.render('success');
  });
});

module.exports = router;
