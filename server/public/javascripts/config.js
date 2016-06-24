'use strict';

Vue.filter('choice', function (value) {
  return String.fromCharCode(value + 65);
});

var questionStorage = {
  fetch: function () {
    var questions = [];

    switch (____params.surveyStatus) {
    case '0':
      questions = JSON.parse(localStorage.getItem('questionList'));
      break;
    case '1':
      questions = JSON.parse(____params.questionList);
      break;
    default:
      break;
    }

    return questions || [];
  },
  save: function (questionList) {
    localStorage.setItem('questionList', JSON.stringify(questionList));
  }
};

var mixin = {
  props: [ 'question', 'order' ],
  data: {
    'edit': false
  },
  created: function () {
    var self = this;

    if (!self.question.choices || !self.question.choices.length) {
      self.$set('question.choices', [{}]);
    }

  },
  ready: function () {
    var self = this;

    var $input = $(self.$el).find('[name^=prompt]');
    var $type = $(self.$el).find('[name^=type]');

    $input.characterCounter();
    $type.material_select(function () {
      var value = $type.val();
      self.$set('question.type', value);
    });
  },
  watch: {
    'edit': 'toggleEdit'
  },
  computed: {
    'hasChoices': function () {
      var self = this;
      var type = self.question.type;
      return (type === 'checkbox' || type === 'radio');
    }
  },
  methods: {
    validate: function () {
      var self = this;

      if (!self.question.prompt) {
        $(self.$el).find('[name^=prompt]').addClass('invalid');
        return false;
      }

      if (!self.question.type) {
        $(self.$el).find('[name^=type]').addClass('invalid');
        return false;
      }

      return true;
    },
    toggleEdit: function (newVal, oldVal) {
      var self = this;

      if (!newVal) {

        if (!self.validate()) {
          self.question.edit = true;
        } else {
          return false;
        }

      }

      self.$nextTick(function () {
        var $input = $(self.$el).find('[name^=prompt]');
        var $type = $(self.$el).find('[name^=type]');

        $input.characterCounter();
        $type.val(self.question.type);
        $type.material_select(function () {
          var value = $type.val();
          self.$set('question.type', value);
        });
      });

    },
    addChoice: function () {
      var self = this;
      var choices = self.question.choices || [];

      if (!choices[choices.length - 1].text) {
        Materialize.toast('You must input some text before adding the next choice!', 1000);
        return false;
      }

      if (choices.length >= 10) {
        Materialize.toast('Can\'t add over 10 choices!', 2000);
        return false;
      }

      self.question.choices.push({});
      self.$nextTick(function () {
        $(self.$el).find('.choice').last().focus();
      });
    },
    addQuestion: function () {
      var self = this;
      var questionToAdd = {};

      if (!self.validate()) {
        return false;
      }

      questionToAdd.prompt = self.question.prompt;
      questionToAdd.type = self.question.type;

      if (self.hasChoices) {

        questionToAdd.choices = self.question.choices.filter(function (choice) {
          return choice.text;
        });

        if (questionToAdd.choices.length < 2) {
          Materialize.toast('You must provide at least two choices!', 1000);
          return false;
        }

      }

      self.$dispatch('add', questionToAdd);
      self.reset();
    },
    deleteQuestion: function () {
      var self = this;
      self.$dispatch('delete', self.order);
    },
    reset: function () {
      var self = this;
      self.question.prompt = '';
      self.question.type = '';
      self.question.choices = [{}];
      self.$nextTick(function () {
        var $type = $(self.$el).find('[name^=type]');
        $type.val(self.question.type);
        $type.material_select(function () {
          var value = $type.val();
          self.$set('question.type', value);
        });
      });
    },
    submitQuestions: function () {
      var self = this;
      self.$dispatch('submit');
    }
  }
};

/* question editing partial */
Vue.partial('edit-question', '#edit-question');

/* question component */
var question = Vue.extend({
  template: '#question',
  components: {
    'edit-question': {
      template: '#edit-question'
    }
  },
  mixins: [mixin]
});

Vue.component('question', question);

/* new question component */
var newQuestion = Vue.extend({
  template: '#new-question',
  components: {
    'edit-question': {
      template: '#edit-question',
      props: ['question', 'order']
    }
  },
  mixins: [mixin]
});

Vue.component('new-question', newQuestion);

var vm = new Vue({
  el: '#app',
  data: {
    'questionList': questionStorage.fetch(),
    "newQuestion": {
      'prompt': '',
      'type': '',
      'choices': [{}]
    }
  },
  events: {
    'delete': function (order) {
      var self = this;
      self.questionList.splice(order - 1, 1);
      questionStorage.save(self.questionList);
    },
    'add': function (question) {
      var self = this;
      self.questionList.push(question);
      questionStorage.save(self.questionList);
    },
    'submit': function () {
      var self = this;
      var questions = self.questionList.map(function (question, index) {
        var obj = {};
        obj.order = index + 1;
        obj.prompt = question.prompt;
        obj.type = question.type;

        if (question.type === 'checkbox' || question.type === 'radio') {
          obj.choices = question.choices;
        }

        return obj;
      });
      $('#questions').val(JSON.stringify(questions));
      return true;
    }
  }
});

$(function () {
  $('input').characterCounter();
});