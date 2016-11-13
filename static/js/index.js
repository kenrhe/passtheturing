var chatbot = null;
var chatbotResponseNumber = 0;
var chatbotResponseIds = {};

$(document).ready(function() {
  controllers.loadChatbot("Alan");
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
  submitQuery: function() {
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
  focusInput: function() {
    $("#input").focus();
  },
  blurInput: function() {
    $("#input").blur();
  },
  showInput: function() {
    $("#input-line").show();
    view.focusInput();
  },
  hideInput: function() {
    view.clearInput();
    $("#input-line").hide();
  },
  addUserLine: function(delay, message) {
    setTimeout(function() {
      $("#output").append("<div class='line'>you$&zwnj;<span class='yellow'>" + message + "</span></div>");
      view.scrollToBottom();
    }, delay);
  },
  addChatbotLine: function(delay, message, hasButtons) {
    setTimeout(function() {
      $("#output").append("<div class='line'>" + chatbot + "$&zwnj;<span class='green'>" + message + "</span></div>");
      if (hasButtons) {
        $("#output div:last").append("<i class='fa fa-thumbs-up' aria-hidden='true' id='up" + chatbotResponseNumber + "'></i><i class='fa fa-thumbs-down' aria-hidden='true' id='down" + chatbotResponseNumber + "'></i>");
      }
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
    this.hideInput();
    this.addUserLine(0, query);
  },
  addResponse: function(response, hasButtons) {
    this.addChatbotLine(0, response, hasButtons);
    this.showInput();
  },
  loadChatbot: function() {
    this.hideInput();
    this.addSystemLine(50, "Loading modules.....");
    this.addSystemLine(100, "Initializing semantic network.....");
    this.addSystemLine(1000, "Creating sandbox.....");
    this.addSystemLine(1400, "Completed!");
    this.addChatbotLine(1500, "Hi! Let's have a conversation!", false);
    setTimeout(function() {
      view.showInput();
    }, 1550);
  },
  quitChatbot: function() {
    this.hideInput();
    this.addSystemLine(100, "Exiting sandbox.....");
    this.addSystemLine(400, "Exiting semantic network.....");
    this.addSystemLine(1100, "Completed!");
    setTimeout(function() {
      view.showInput();
    }, 1150);
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
