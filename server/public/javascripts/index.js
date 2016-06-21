'use strict';

var Question = Vue.extend({
  data: {
    question: {}
  },
  ready: function () {
    var self = this;
    var jsonStr = $(self.$el).find('[name$=json]').val();
    var json = JSON.parse(jsonStr);
    json.checked = [];
    self.$set('question', json);
    self.$nextTick(function () {
      self.$dispatch('push', json);
    });
  },
  watch: {
    'question': {
      deep: true,
      handler: function () {
        var self = this;
        self.$set('question.answered', Boolean((self.question.answer) || (self.question.checked.length)));
      }
    }
  }
});

$(function () {

  var size = $('.question').size();
  var anchors = Array.apply(null, { length: size }).map(function(value, index){
    return (index + 1).toString();
  });

  $('#fullPage').fullpage({
    sectionSelector: '.page',
    anchors: ['index'].concat(anchors)
  });

  var vm = new Vue({
    el: '#app',
    created: function () {
      var self = this;

      $('.question').each(function (idx, el) {
        var question = new Question({
          el: el
        });
        question.$parent = self;
      });
    },
    data: {
      questionList: [],
      finished: false,
      answeredNum: 0,
      percentage: 0
    },
    computed: {
      'percentage': function () {
        var self = this;
        return self.answeredNum / self.questionList.length * 100;
      },
      'finished': function () {
        var self = this;
        return self.questionList.every(function (question) {
          return question.answered;
        });
      },
      'answeredNum': function () {
        var self = this;
        return self.questionList.filter(function (question) {
          return question.answered;
        }).length;
      }
    },
    events: {
      'push': function (question) {
        var self = this;
        self.questionList.push(question);
      }
    },
    components: {
      'question': Question
    }
  });

});