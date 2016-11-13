var chatbot = null;
var chatbotResponseNumber = 0;
var chatbotResponseIds = {};
var startTime = null;
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
  $("#output").on("click", "i", function() {
    var id = this.id;
    if (id.substring(0, 2) === "up") {
      controllers.upvote(id.substring(2 , id.length));
    } else {
      controllers.downvote(id.substring(4, id.length));
    }
    view.focusInput();
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
      startTime = new Date();
      asked = false;
      controllers.addId(data.id);
      view.addResponse(data.response, !data.isDefault);
    });
  },
  submitQuery: function() {
    startTime = new Date();
    asked = false;
    var query = $("#input").text();
    view.addQuery(query);
    // if (query.substring(0, 8) === "(chatbot") {
    //   if (!chatbot) {
    //     return this.loadChatbot(query.substring(9, query.length - 1));
    //   } else {
    //     return view.addSystemLine(0, "Need to quit current chatbot");
    //   }
    // } else if (query === "(quit)") {
    //   if (chatbot) {
    //     return this.quitChatbot();
    //   } else {
    //     return view.addSystemLine(0, "No current chatbot");
    //   }
    // }
    // if (chatbot) {
      view.addResponseProcessing();
      $.getJSON('/submit', {
        query: query
      }, function(data) {
        controllers.addId(data.id);
        view.addResponse(data.response, !data.isDefault);
      });
    // } else {
      // return view.addSystemLine(0, "No current chatbot");
    // }
  },
  loadChatbot: function(name) {
    chatbot = name;
    view.loadChatbot();
  },
  quitChatbot: function() {
    chatbot = null;
    view.quitChatbot();
  },
  addId: function(id) {
    chatbotResponseNumber++;
    chatbotResponseIds.chatbotResponseNumber = id;
  },
  upvote: function(chatbotResponseNumber) {
    $.getJSON('/upvote', {
      id: chatbotResponseIds[chatbotResponseNumber]
    }, function() {
      view.upvote(chatbotResponseNumber);
    });
  },
  downvote: function(chatbotResponseNumber) {
    $.getJSON('/downvote', {
      id: chatbotResponseIds[chatbotResponseNumber]
    }, function() {
      view.downvote(chatbotResponseNumber);
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
  addChatbotLine: function(delay, message, hasButtons) {
    setTimeout(function() {
      $("#output").append("<div class='line'>" + chatbot + "$ &zwnj;<span class='green'>" + message + "</span></div>");
      // if (hasButtons) {
      //   $("#output div:last").append("<div class='buttons'><i class='fa fa-thumbs-up' aria-hidden='true' id='up" + chatbotResponseNumber + "'></i><i class='fa fa-thumbs-down' aria-hidden='true' id='down" + chatbotResponseNumber + "'></i></div>");
      // }
      view.scrollToBottom();
    }, delay);
  },
  addSystemLine: function(delay, message) {
    setTimeout(function() {
      $("#output").append("<div class='line'>system$&zwnj;<span class='orange'>" + message + "</span></div>");
      view.scrollToBottom();
    }, delay);
  },
  addQuery: function(query) {
    this.disableInput();
    this.addUserLine(0, query);
  },
  addResponseProcessing: function() {
    this.addChatbotLine(0, "Alan is reading the message", false);
  },
  addResponse: function(response, hasButtons) {
    var length = response.length * 100;
    setTimeout(function() {
      $("#output div:last").remove();
    }, 1500);
    this.addChatbotLine(1500, "Alan is typing...", false);
    setTimeout(function() {
      $("#output div:last").remove();
    }, Math.max(3000, length));
    this.addChatbotLine(Math.max(3000, length), response, hasButtons);
    setTimeout(function() {
      view.enableInput();
    }, Math.max(3000, length));
  },
  loadChatbot: function() {
    this.hideInput();
    this.addSystemLine(50, "Loading modules.....");
    this.addSystemLine(100, "Initializing semantic network.....");
    this.addSystemLine(1000, "Creating sandbox.....");
    this.addSystemLine(1400, "Completed!");
    this.addChatbotLine(1500, "Hey! How're you doing today?", false);
    setTimeout(function() {
      view.showInput();
    }, 1500);
  },
  quitChatbot: function() {
    this.hideInput();
    this.addSystemLine(100, "Exiting sandbox.....");
    this.addSystemLine(400, "Exiting semantic network.....");
    this.addSystemLine(1100, "Completed!");
    setTimeout(function() {
      view.showInput();
    }, 1100);
  },
  upvote: function(chatbotResponseNumber) {
    $("#up" + chatbotResponseNumber).addClass("yellow");
    $("#down" + chatbotResponseNumber).removeClass("yellow");
  },
  downvote: function(chatbotResponseNumber) {
    $("#down" + chatbotResponseNumber).addClass("yellow");
    $("#up" + chatbotResponseNumber).removeClass("yellow");
  }
};
