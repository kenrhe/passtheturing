var chatbot = null;
var chatbotResponseNumber = 0;
var chatbotResponseIds = {};
var startTime = new Date();
var asked = false;

$(document).ready(function() {
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
  askQuestion: function() {
    asked = true;
    $.getJSON('/question', {}, function(data) {
      controllers.addId(data.id);
      view.addQuestionResponse(data.response);
    });
  },
  submitQuery: function() {
    startTime = new Date();
    asked = false;
    var query = $("#input").text();
    view.addQuery(query);
    view.addResponseProcessing();
    $.getJSON('/submit', {
      query: query
    }, function(data) {
      controllers.addId(data.id);
      view.addResponse(data.response);
    });
  },
  addId: function(id) {
    chatbotResponseNumber++;
    chatbotResponseIds.chatbotResponseNumber = id;
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
  addChatbotLine: function(delay, message, hasButtons) {
    setTimeout(function() {
      $("#output").append("<div class='line'>" + chatbot + "$ &zwnj;<span class='green'>" + message + "</span></div>");
      view.scrollToBottom();
    }, delay);
  },
  addQuery: function(query) {
    this.disableInput();
    this.addUserLine(0, query);
  },
  addResponseProcessing: function() {
    this.addChatbotLine(0, "Alan is reading the message");
  },
  addResponse: function(response) {
    var length = response.length * 100;
    setTimeout(function() {
      $("#output div:last").remove();
    }, 1500);
    this.addChatbotLine(1500, "Alan is typing...");
    setTimeout(function() {
      $("#output div:last").remove();
    }, Math.max(3000, length));
    this.addChatbotLine(Math.max(3000, length), response);
    setTimeout(function() {
      view.enableInput();
    }, Math.max(3000, length));
  },
  addQuestionResponse: function(response) {
    this.addChatbotLine(0, "Alan is typing...");
    setTimeout(function() {
      $("#output div:last").remove();
    }, Math.max(1500, length));
    this.addChatbotLine(Math.max(1500, length), response);
    setTimeout(function() {
      view.enableInput();
    }, Math.max(1500, length));
  }
};
