'use strict';

var path = require('path');

var fs =  require('graceful-fs');
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

module.exports = router;
