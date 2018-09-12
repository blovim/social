/***********************************************
* LIBRARY TITLE: Youtube Channels JQuery
* DEVELOPED BY: Blovim Inc 2010.
* 
* URL: https://www.blovim.com/
* VERSION: 18/1089
***********************************************/
var channels_name='GaranCom',
    channels_title='Garantías Comunitarias',
    apikey='AIzaSyCj2GrDSBy6ISeGg3aWUM4mn3izlA1wgt0'; //YOUR GOOGLE API KEY

$.ajax({
    url: 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + channels_name + '&key=' + apikey,
    crossDomain: true,
    dataType: 'json'
}).done(function(a) {
    var b = a.items[0].contentDetails.relatedPlaylists.uploads,
        chid = a.items[0].id,
        nekpag = '';
    youtube_video_list(b, apikey, nekpag, channels_title, chid, channels_name)
});

function youtube_video_list(f, g, h, j, k, l) {
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + f + '&key=' + g + '&pageToken=' + h,
        dataType: 'json'
    }).done(function(c) {
        var d = '';
        d += '<div class="ibacordotcom-vid-top"><span class="ibacordotcom-nav-title">' + j + '</span><br><span class="ibacordotcom-vid-by">Por <a href="https://www.youtube.com/user/' + l + '" target="_BLANK">' + l + '</a></span><hr>';
        d += '<i class="fa fa-fast-backward ibacordotcom_vid_prev" title="Previous videos"></i> ';
        d += '<i class="fa fa-fast-forward ibacordotcom_vid_next" title="Next videos"></i></div><div class="ibacordotcom-vid-bottom">';
        $.each(c.items, function(i, a) {
            var b = c.items[i].snippet.resourceId.videoId;
            getwaktu(b, i, g);
            d += '<div class="ibacordotcom-play" data-vvv="' + b + '"><div class="ibacordotcom_youtube_thumb"><img src="' + c.items[i].snippet.thumbnails.default.url + '" alt="ibacor"><span class="ibacordotcom-vid-tm' + i + '"></span></div>';
            d += c.items[i].snippet.title + '</div>'
        });
        d += '</div>';
        $('.ibacordotcom_youtube_channels').html(d);
        if (c.prevPageToken == null) {
            var e = $(".ibacordotcom-play").attr("data-vvv");
            youtube_det(e, k, l, g)
        }
        if (c.prevPageToken != null) {
            $('.ibacordotcom_vid_prev').click(function() {
                var a = c.prevPageToken;
                youtube_video_list(f, g, a, j, k, l);
                return false
            })
        }
        $('.ibacordotcom_vid_next').click(function() {
            var a = c.nextPageToken;
            youtube_video_list(f, g, a, j, k, l);
            return false
        });
        $(".ibacordotcom-play").each(function() {
            $(this).click(function() {
                var a = $(this).attr("data-vvv");
                $('div').removeClass('ibacordotcom-vid-active');
                $(this).addClass('ibacordotcom-vid-active');
                youtube_det(a, k, l, g);
                return false
            })
        })
    })
}

function youtube_det(c, d, e, g) {
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/videos?id=' + c + '&key=' + g + '&part=snippet,statistics',
        dataType: 'json'
    }).done(function(a) {
        var b = '',
            viewc = a.items[0].statistics.viewCount,
            likc = a.items[0].statistics.likeCount,
            likd = a.items[0].statistics.dislikeCount,
            category = '',
            judul = a.items[0].snippet.localized.title,
            desc = a.items[0].snippet.localized.description;
        b += '<iframe src="https://www.youtube.com/embed/' + c + '&rel=0" allowfullscreen="" frameborder="0"></iframe>';
        b += '<div class="row author_area"><div class="col s8 author"><div class="col s12 media_body"><a href="https://www.youtube.com/channel/' + d + '" target="_BLANK">' + a.items[0].snippet.channelTitle + '</a>' + _timeSince(new Date(a.items[0].snippet.publishedAt).getTime()) + '</div></div><div class="col s4 views">' + addCommas(viewc) + ' vistas</div></div>';
        b += '<div class="post_heding_aea"><span class="post_heding">' + judul + '</span><p>' + urlify(desc).replace(/\n/g, '<br>') + '</p></div>';
        b += '<div class="ibacordotcom-vid-box"><i class="fa fa-thumbs-down pull-left">' + addCommas(likc) + '</i><i class="fa fa-thumbs-down pull-right"> ' + addCommas(likd) + '</i><i class="fa fa-thumbs-up pull-right"> </div>';
        gplus(e, g);
        $('.gc_tv_play').html(b)
    })
}

function getwaktu(c, i, g) {
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/videos?id=' + c + '&key=' + g + '&part=contentDetails',
        dataType: 'json'
    }).done(function(a) {
        var b = a.items[0].contentDetails.duration,
            dataw = '',
            menit = '',
            detik = '';
		if(b.match(/M/g)){
            dataw = b.split('M');
            menit = dataw[0].replace('PT','');
			if(dataw[1] != ''){
				detik = dataw[1].replace('S','');
			}else{
				detik = '00';
			}
		}else{
            dataw = b.split('PT');
			menit = '00';
			detik = dataw[1].replace('S','');
		}
        $('.ibacordotcom-vid-tm' + i).html(menit + ':' + detik)
    })
}

function urlify(b) {
    var c = /(https?:\/\/[^\s]+)/g;
    return b.replace(c, function(a) {
        return '<a href="' + a + '" rel="nofollow" target="_BLANK">' + a + '</a>'
    })
}

function gplus(c, g) {
    var d = 'https://www.googleapis.com/plus/v1/people/',
        apiend = '/activities/public',
        fields = 'items(actor(image(url)))';
    $.ajax({
        url: d + '+' + c + apiend + '?key=' + g + '&fields=' + fields + '&maxResults=1',
        crossDomain: true,
        dataType: 'jsonp'
    }).done(function(a) {
        var b = a.items,
            i = 0,
            html = '';
        for (i = 0; i < b.length; i += 1) {
            html += '<img src="' + b[i].actor.image.url + '" alt="" />'
        }
        $('#ibacordotcom-user-img').html(html)
    })
}

function _timeSince(a) {
    var s = Math.floor((new Date() - a) / 1000),
        i = Math.floor(s / 31536000);
    if (i > 1) {
        return "Publicado hace " + i + " año(s)"
    }
    i = Math.floor(s / 2592000);
    if (i > 1) {
        return "Publicado hace " + i + " mes(es)"
    }
    i = Math.floor(s / 86400);
    if (i > 1) {
        return "Publicado hace " + i + " día(s)"
    }
    i = Math.floor(s / 3600);
    if (i > 1) {
        return "Publicado hace " + i + " hora(s)"
    }
    i = Math.floor(s / 60);
    if (i > 1) {
        return "Publicado hace " + i + " minuto(s)"
    }
    return "Publicado hace " + Math.floor(s) + " segundo(s)"
}

function addCommas(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
