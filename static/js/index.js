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