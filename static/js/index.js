var chatbot = null;

$(document).ready(function() {
  view.focusInput();
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
      return controllers.upvote(id.substring(2 , id.length));
    } else {
      return controllers.downvote(id.substring(4, id.length));
    }
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
        view.addResponse(data.response, data._id);
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
  upvote: function(id) {
    $.getJSON('/upvote', {
      id: id
    }, function() {
      view.upvote(id);
    });
  },
  downvote: function(id) {
    $.getJSON('/downvote', {
      id: id
    }, function() {
      view.downvote(id);
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
  addUserLine: function(delay, message) {
    setTimeout(function() {
      $("#output").append("<div class='line'>user$ &zwnj;<span class='yellow'>" + message + "</span></div>");
      view.scrollToBottom();
    }, delay);
  },
  addChatbotLine: function(delay, message, id) {
    setTimeout(function() {
      $("#output").append("<div class='line'>" + chatbot + "$ &zwnj;<span class='green'>" + message + "</span><i class='fa fa-thumbs-up' aria-hidden='true' id='up" + id + "'></i><i class='fa fa-thumbs-down' aria-hidden='true' id='down" + id + "'></i></div>");
      view.scrollToBottom();
    }, delay);
  },
  addSystemLine: function(delay, message) {
    setTimeout(function() {
      $("#output").append("<div class='line'>system$ &zwnj;<span class='orange'>" + message + "</span></div>");
      view.scrollToBottom();
    }, delay);
  },
  addQuery: function(query) {
    this.addUserLine(0, query);
    this.clearInput();
    this.blurInput();
  },
  addResponse: function(response, id) {
    this.addChatbotLine(0, response, id);
    this.focusInput();
  },
  loadChatbot: function() {
    this.addSystemLine(50, "Loading modules.....");
    this.addSystemLine(100, "Initializing semantic network.....");
    this.addSystemLine(1000, "Creating sandbox.....");
    this.addSystemLine(1400, "Completed!");
    this.addChatbotLine(1500, "Hi! Let's have a conversation!");
  },
  quitChatbot: function() {
    this.addSystemLine(100, "Exiting sandbox.....");
    this.addSystemLine(400, "Exiting semantic network.....");
    this.addSystemLine(1100, "Completed!");
  },
  upvote: function(id) {
    $("$up" + id).addClass("yellow");
    $("$down" + id).removeClass("yellow");
  },
  downvote: function(id) {
    $("$down" + id).addClass("yellow");
    $("$up" + id).removeClass("yellow");
  }
};
