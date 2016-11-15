var chatbot;
var chatbotResponseNumber;
var startTime;
var asked;

$(document).ready(function() {
  chatbot = null;
  chatbotResponseNumber = 0;
  startTime = new Date();
  asked = false;

  controllers.startTimer();
  chatbot = "Alan";
  view.focusInput();

  $("#input").on("keydown", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      controllers.submitQuery();
    }
  });
});

var controllers = {
  startTimer: function() {
    window.setInterval(function() {
      if (new Date() - startTime > 20000 && !asked) {
        return controllers.askQuestion();
      }
    }, 1000);
  },
  resetTimer: function() {
    startTime = new Date();
    asked = false;
  },
  askQuestion: function() {
    asked = true;
    $.getJSON('/question', {}, function(data) {
      view.addQuestionResponse(data.response);
    });
  },
  submitQuery: function() {
    controllers.resetTimer();
    var query = $("#input").text();
    view.addQuery(query);
    var id = view.addResponseReading();
    $.getJSON('/submit', {
      query: query
    }, function(data) {
      view.addResponse(id, data.response);
      controllers.resetTimer();
    });
  }
};

var view = {
  scrollToBottom: function() {
    window.scrollTo(0, document.body.scrollHeight);
  },
  clearInput: function() {
    $("#input").text("");
  },
  blurInput: function() {
    $("#input").blur();
  },
  focusInput: function() {
    $("#input").focus();
  },
  disableInput: function() {
    this.clearInput();
    $("#input").attr("contenteditable", false);
  },
  enableInput: function() {
    $("#input").attr("contenteditable", true);
    this.focusInput();
  },
  hideInput: function() {
    this.clearInput();
    $("#input-line").css("visibility", "hidden");
  },
  showInput: function() {
    $("#input-line").css("visibility", "visible");
    this.focusInput();
  },
  addUserLine: function(delay, message) {
    setTimeout(function() {
      $("#output").append("<div class='line'>you$ &zwnj;<span class='yellow'>" + message + "</span></div>");
      view.scrollToBottom();
    }, delay);
  },
  addChatbotLine: function(delay, message) {
    var id = ++chatbotResponseNumber;
    setTimeout(function() {
      $("#output").append("<div class='line' id='" + id + "'>" + chatbot + "$ &zwnj;<span class='green'>" + message + "</span></div>");
      view.scrollToBottom();
    }, delay);
    return id;
  },
  changeChatbotLine: function(id, delay, message) {
    setTimeout(function() {
      $("#" + id + " span").html(message);
      view.scrollToBottom();
    }, delay);
  },
  addQuery: function(query) {
    this.disableInput();
    this.addUserLine(0, query);
  },
  addResponseReading: function() {
    var id = this.addChatbotLine(0, "Alan is reading the message");
    return id;
  },
  addResponse: function(id, response) {
    var length = response.length * 100;
    this.changeResponseTyping(id);
    this.changeChatbotLine(id, Math.max(3000, length), response);
    setTimeout(function() {
      view.enableInput();
    }, Math.max(3000, length));
  },
  addQuestionResponse: function(response) {
    var length = responsed.length * 100;
    var id = this.addChatbotLine(0, "Alan is typing...");
    this.changeChatbotLine(id, Math.max(1500, length), response);
    setTimeout(function() {
      view.enableInput();
    }, Math.max(1500, length));
  }
};
