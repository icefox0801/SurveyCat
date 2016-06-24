'use strict';

var path = require('path');

var _ = require('lodash');
var fs =  require('graceful-fs');
var DataStore = require('nedb');
var YAML = require('yamljs');
var express = require('express');
var router = express.Router();

/* GET report page. */
router.get('/', function(req, res, next) {
  var db = new DataStore({
    filename: path.join(req.surveycat.dir, 'datafile'),
    autoload: true
  });

  var questions = [];
  var questionsFile = path.join(req.surveycat.dir, 'questions.yml');

  if (fs.existsSync(questionsFile)) {
    questions = YAML.load(questionsFile);
  }

  db.find({}, function (err, docs) {

    questions = questions.map(function (question) {

      if (question.type === 'checkbox' || question.type === 'radio') {
        question.choices.forEach(function (choice) {
          choice.count = 0;
        });
      } else {
        question.answers = [];
      }

      return question;

    });

    var statistics = docs.reduce(function (total, sample) {

      total.forEach(function (question, idx) {
        var answer = sample.answers[idx];

        if (question.type === 'checkbox') {

          if (!answer.checked) {
            answer.checked = [];
          }

          answer.checked.forEach(function (choice) {
            var index = choice.charCodeAt(0) - 65;

            if (question.choices[index]) {
              question.choices[index].count += 1;
            }

          });
        } else if (question.type === 'radio') {

          if (!answer.checked || !answer.checked.length) {
            answer.checked = '';
          }

          var index = answer.checked.charCodeAt(0) - 65;

          if (question.choices[index]) {
            question.choices[index].count += 1;
          }

        } else {

          if (answer.answer) {
            question.answers.push(answer.answer);
          }
        }

      });

      return total;
    }, questions);

    console.log(statistics);
    res.render('report', {
      surveycat: req.surveycat,
      statistics: statistics
    });
  });

});

module.exports = router;
