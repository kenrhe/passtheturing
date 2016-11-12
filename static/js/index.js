$(document).ready(function() {
  $("#1,#2,#3,#4,#5,#6,#7").hide();
  $("#1").delay(50).fadeIn(0);
  $("#2").delay(100).fadeIn(0);
  $("#3").delay(150).fadeIn(0);
  $("#4").delay(800).fadeIn(0);
  $("#5").delay(1200).fadeIn(0);
  $("#6").delay(1250).fadeIn(0);
  $("#7").delay(1300).fadeIn(0);
  setTimeout(function() {
    view.focusInput();
  }, 1350);
  $("#input").on("keydown", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      view.hideInput();
      controllers.submitQuery();
    }
  });
});

var controllers = {
  submitQuery: function() {
    var query = $("#input").text();
    $.post({
      url: '/submit',
      data: query
    }).done(function(data) {
      if (data.success) {
        view.addQueryAndResponse(query, data.response);
      } else {
        console.log(err);
      }
    }).fail(function(err) {
      console.log(err);
    });
  }
};

var view = {
  scrollToBottom: function() {
    window.scrollTo(0, document.body.scrollHeight);
  },
  showInput: function() {
    $("#input").show();
  },
  hideInput: function() {
    $("#input").hide();
  },
  clearInput: function() {
    $("#input").text("");
  },
  focusInput: function() {
    $("#input").focus();
  },
  addQueryAndResponse: function(query, response) {
    $("#bash-output").append("<div class='bash-line'>user$ <span class='yellow'> " + query + "</span></div>\
      <div class='bash-line'>chatbot$ <span class='green'> " + response + "</span></div>");
    view.clearInput();
    view.showInput();
    view.focusInput();
    view.scrollToBottom();
  }
};
