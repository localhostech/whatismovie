function writeResults(movies) {
  var count = Object.keys(movies).length;
  $('.results').html('')
  var i = 0;
  $('html, body').animate({
        scrollTop: $(".results").offset().top
    }, 500);
  while (i < count) {
    i++;
    $('.results').append('<div class="movie-card"><a href="http://www.imdb.com/title/' + movies[i].imdb.id +'/" target="_blank"><img src="'+ movies[i].poster +'"><p>'+ movies[i].title +' ('+ movies[i].year +')</p></a></div>')
  }
}
$(function() {
	$('form[name="search-form"]').on('submit', function() {
		var form = $(this);
		$('.preloader').fadeIn();
		 $.ajax({
            url: "/",
            method: "POST",
            data: {api_key: '7q6KqMmV33JZWsdq', text: $('form[name="search-form"] input[type="text"]').val().replace(/\s/ig, '+')},
            complete: function() {
        		
      		},
            statusCode: {
              200: function(data) {
                console.log(data.imdb);
                $('.preloader').fadeOut();
                writeResults(data.imdb);

              },
              403: function() {
                console.log('Some error');
              }
            }
        });
		return false;
	});
	$(window).scroll(function() {
	   var hT = $('.results').offset().top,
	       hH = $('.results').outerHeight(),
	       wH = $(window).height(),
	       wS = $(this).scrollTop();
	   if (wS > (hT+hH-wH)){
	       alert('you have scrolled to the h1!');
	   }
	});
});