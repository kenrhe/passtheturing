var chatbot = null;
var chatbotResponseNumber = 0;
var chatbotResponseIds = {};

$(document).ready(function() {
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
  submitQuery: function() {
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
  },
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
    var max = Math.max(3000, length);
    setTimeout(function() {
      $("#output div:last").empty();
    }, 1500);
    this.addChatbotLine(1500, "Alan is typing...");
    setTimeout(function() {
      $("#output div:last").empty();
    }, max);
    this.addChatbotLine(max, response);
    setTimeout(function() {
      view.enableInput();
    }, max);
  }
};
