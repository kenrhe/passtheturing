var chatbot;
var lineNumber;
var startTime;
var asked;

$(document).ready(function() {
  chatbot = null;
  lineNumber = 0;
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
    $.getJSON('/question', function(data) {
      view.addQuestionResponse(data.response);
    });
  },
  submitQuery: function() {
    this.resetTimer();
    var query = $("#input").text();
    view.addQuery(query);
    var id = view.addQueryResponse();
    $.getJSON('/submit', {
      query: query
    }, function(data) {
      view.changeQueryResponse(id, data.response);
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
    $("#input").attr("contenteditable", false);
  },
  enableInput: function() {
    $("#input").attr("contenteditable", true);
  },
  hideInput: function() {
    $("#input-line").css("visibility", "hidden");
  },
  showInput: function() {
    $("#input-line").css("visibility", "visible");
  },
  addLine: function(delay, sender, color, message) {
    var id = ++lineNumber;
    setTimeout(function() {
      $("#output").append("<div class='line' id=" + id + ">" + sender + "$ &zwnj;<span class=" + color + ">" + message + "</span></div>");
      view.scrollToBottom();
    }, delay);
    return id;
  },
  addChatbotLine: function(delay, message) {
    var id = this.addLine(delay, chatbot, "green", message);
    return id;
  },
  addUserLine: function(delay, message) {
    var id = this.addLine(delay, "You", "yellow", message);
    return id;
  },
  changeChatbotLine: function(id, delay, message) {
    setTimeout(function() {
      $("#" + id + " span").html(message);
      view.scrollToBottom();
    }, delay);
  },
  changeResponseTyping: function(id, delay, time) {
    setTimeout(function() {
      length = (time - delay) / 200;
      message = "Alan is typing";
      for (var i = 1; i < length; i++) { 
        view.changeChatbotLine(id, 200 * (i - 1), message);
        message += ".";
        if (i % 6 === 0 && i > 0) {
          message = message.substring(0, message.length - 6);
        }
      }
    }, delay);
  },
  changeResponse: function(id, response, delayTyping, delayResponse) {
    var timeResponse = response.length * 100;
    var time = Math.max(delayResponse, timeResponse);
    this.changeResponseTyping(id, delayTyping, time);
    this.changeChatbotLine(id, time, response);
    setTimeout(function() {
      view.enableInput();
      view.focusInput();
    }, time);
  },
  addQuestionResponse: function(response) {
    var id = this.addChatbotLine(0, "Alan is typing");
    this.changeResponse(id, response, 0, 1500);
  },
  addQuery: function(query) {
    this.clearInput();
    this.disableInput();
    var id = this.addUserLine(0, query);
    return id;
  },
  addQueryResponse: function() {
    var id = this.addChatbotLine(0, "Alan is reading the message");
    return id;
  },
  changeQueryResponse: function(id, response) {
    this.changeResponse(id, response, 1500, 3000);
  }
};
