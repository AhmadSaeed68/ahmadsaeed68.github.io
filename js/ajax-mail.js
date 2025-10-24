$(function() {
  // If you want AJAX behavior, add data-ajax="true" to the form; otherwise allow normal submit/redirect
  var form = $('#contact-form');
  if (!form.length || form.data('ajax') !== true) return;

  var formMessages = $('.form-messege');
  form.on('submit', function(e) {
    e.preventDefault();
    var formData = form.serialize();
    $.ajax({
      type: 'POST',
      url: form.attr('action'),
      data: formData
    }).done(function(response) {
      $(formMessages).removeClass('error').addClass('success').text(response || 'Message sent.');
      form.find('input,textarea').val('');
    }).fail(function(data) {
      $(formMessages).removeClass('success').addClass('error');
      $(formMessages).text(data && data.responseText ? data.responseText : 'Oops! An error occurred and your message could not be sent.');
    });
  });
});
