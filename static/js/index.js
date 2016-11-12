$(document).ready(function() {
  $("#1,#2,#3,#4,#5,#6,#7").hide();
  $("#1").delay(50).fadeIn(0);
  $("#2").delay(100).fadeIn(0);
  $("#3").delay(150).fadeIn(0);
  $("#4").delay(800).fadeIn(0);
  $("#5").delay(1200).fadeIn(0);
  $("#6").delay(1250).fadeIn(0);
  $("#7").delay(1300).fadeIn(0);
  $("#input").delay(1350).focus();
  $("#input").on("keydown", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      controllers.submitQuery();
    }
  });
});

var controllers = {
  submitQuery: function() {
    var query = $("#input").val();
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
  addQueryAndResponse: function(query, response) {
    $("#bash").apppend("<br>$ <span class='yellow'> "+ query + "</span>\
      <br>chatbot$ <span class='green'> " + response + "</span>");
  }
};
