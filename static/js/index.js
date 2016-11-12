var chatbot = null;

$(document).ready(function() {
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
    if (query.substring(0, 8) === "(chatbot") {
      if (!chatbot) {
        return this.loadChatbot(query.substring(9, query.length - 1));
      } else {
        return view.addSystemLine(0, "Need to quit current chatbot");
      }
    } else if (query === "(quit)") {
      if (chatbot) {
        return this.quitChatbot();
      } else {
        return view.addSystemLine(0, "No current chatbot");
      }
    }
    if (chatbot) {
      $.post({
        url: '/submit',
        data: query
      }).done(function(data) {
        if (data.success) {
          view.addResponse(data.response);
        } else {
          view.addSystemLine(0, data.response);
        }
      }).fail(function(err) {
        console.log(err);
      });
    } else {
      return view.addSystemLine(0, "No current chatbot");
    }
  },
  loadChatbot: function(name) {
    chatbot = name;
    view.loadChatbot();
  },
  quitChatbot: function() {
    chatbot = null;
    view.quitChatbot();
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
  addUserLine: function(delay, message) {
    setTimeout(function() {
      $("#output").append("<div class='line'>user$ <span class='yellow'>" + message + "</span></div>");
      view.scrollToBottom();
    }, delay);
  },
  addChatbotLine: function(delay, message) {
    setTimeout(function() {
      $("#output").append("<div class='line'>" + chatbot + "$ <span class='green'>" + message + "</span></div>");
      view.scrollToBottom();
    }, delay);
  },
  addSystemLine: function(delay, message) {
    setTimeout(function() {
      $("#output").append("<div class='line'>system$ <span class='orange'>" + message + "</span></div>");
      view.scrollToBottom();
    }, delay);
  },
  addQuery: function(query) {
    this.addUserLine(0, query);
    this.clearInput();
  },
  addResponse: function(response) {
    this.addChatbotLine(0, response);
    this.focusInput();
  },
  loadChatbot: function() {
    this.addSystemLine(50, "Loading modules.....");
    this.addSystemLine(100, "Initializing synaptic network.....");
    this.addSystemLine(1000, "Creating sandbox.....");
    this.addSystemLine(1400, "Completed!");
    this.addChatbotLine(1500, "Hi! Let's have a conversation!");
  },
  quitChatbot: function() {
    this.addSystemLine(100, "Exiting sandbox.....");
    this.addSystemLine(400, "Exiting synaptic network.....");
    this.addSystemLine(1100, "Completed!");
  }
};
