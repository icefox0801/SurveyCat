'use strict';

var path = require('path');

var fs =  require('graceful-fs');
var YAML = require('yamljs');
var express = require('express');
var router = express.Router();

/* GET config page. */
router.get('/', function(req, res, next) {
  var questions = [];
  var questionsFile = path.join(req.surveycat.dir, 'questions.yml');

  if (fs.existsSync(questionsFile)) {
    questions = YAML.load(questionsFile);
  }

  var surveyStatus = questions.length ? '1' : '0';
  res.render('config', {
    surveycat: req.surveycat,
    surveyStatus: surveyStatus,
    questionList: JSON.stringify(questions)
  });

});

/* POST config page */
router.post('/', function(req, res, next) {
  var questions = JSON.parse(req.body.questions);
  fs.writeFileSync(path.join(req.surveycat.dir, 'questions.yml'), YAML.stringify(questions, 6, 2));
  res.render('success');
});

module.exports = router;
