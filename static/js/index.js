$(document).ready(function() {
  $("#input").focus();
  $("#input").on("keydown", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      controllers.submitQuery();
    }
  });
});

var controllers = {
  submitQuery: function() {
    $.post({
      url: '/submit',
      data: $("#input").val()
    }).done(function(data) {
      view.addQueryAndResponse();
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