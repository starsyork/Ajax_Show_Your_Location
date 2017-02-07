
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();


    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    var street = streetStr +', '+ cityStr;
    //load greeting
    $greeting.text('So, do you like this place' + street)

    // load streetview

    var streetURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location='+ street;
    $body.append('<img class="bgimg" src="'+streetURL+' ">');

    //load nytimes
    //var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr +'&sort=newest&api-key=41c8d3869bcd48fa8b2cec147cd35bcc';
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({'api-key': "41c8d3869bcd48fa8b2cec147cd35bcc",'q':cityStr});
    $.getJSON(url, function(data) {
      var articles = data.response.docs;
      for (var i = 0; i < articles.length; i++) {
        var article = articles[i];
        $nytElem.append('<li class = "article">' +'<a href="'+article.web_url+'">' +article.headline.main +'</a>' + '<p>'+article.snoppet+'</p>' + '</li>');
      };
    }).error(function(e){
      $nytHeaderElem.text('New Yrok Times Could Not Be Loaded');
    });

    //load wikiElem
    var wikiurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+cityStr+'&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
      $wikiElem.text("Fail tp get wikipedia resources");
    },8000);

    $.ajax({
      url:wikiurl,
      dataType: "jsonp",
      success: function(response) {
        var articleList = response[1];
        for(var i =0; i< articleList.length;i++){
          articleStr = articleList[i];
          var url = 'http://en.wikipedia.org/wiki/' + articleStr;
          $wikiElem.append('<li><a href = "'+url+'">' + articleStr +'</a></li>');
        };
        clearTimeout(wikiRequestTimeout);
      }
    });




    return false;
};

$('#form-container').submit(loadData);
