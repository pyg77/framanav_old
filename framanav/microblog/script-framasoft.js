var tweetFrama = ['framasoft'];
var tweetUsers = ['laquadrature','nitot','pscoffoni','toolinux'];
var buildString = "";
var buildStringFriends = "";

$(document).ready(function(){

	//$('#twitter-ticker').slideDown('slow');
	$('#twitter-ticker-friends').slideDown('slow');
	/*
	for(var i=0;i<tweetFrama.length;i++)
	{
		if(i!=0) buildString+='+OR+';
		buildString+='from:'+tweetFrama[i];
	}
	
	var fileref = document.createElement('script');
	
	fileref.setAttribute("type","text/javascript");
	fileref.setAttribute("src", "http://identi.ca/api/search.json?q="+buildString+"&callback=TweetTick&rpp=20");
	
	document.getElementsByTagName("head")[0].appendChild(fileref);
	
	*/
	
	  $('#tweet-container').rssfeed('http://identi.ca/api/statuses/user_timeline/246727.atom', {
			limit: 20,
			header: false,
			titletag: 'div',
			//date: false,
			content: true,
			snippet: false,
			showerror: true,
			zcss: 'rssFeed'  }).ajaxStop(function() {
				$('#tweet-container').jScrollPane()
			});
	
	//var container=$('#tweet-container');
	//container.jScrollPane();	

	
	// ----------------------------------------
	
	for(var i=0;i<tweetUsers.length;i++)
	{
		if(i!=0) buildStringFriends+='+OR+';
		buildStringFriends+='from:'+tweetUsers[i];
	}
	fileref = document.createElement('script');
	
	fileref.setAttribute("type","text/javascript");
	fileref.setAttribute("src", "http://search.twitter.com/search.json?q="+buildStringFriends+"&callback=TweetTickFriends&rpp=30");
	
	document.getElementsByTagName("head")[0].appendChild(fileref);
	
});

function TweetTick(ob)
{
	var container=$('#tweet-container');
	container.html('');
	var i=0;
	$(ob.results).each(function(el){
		i=i+1
		if (i==1) {
			var FramaLastTweet = mbreadCookie("FramaLastTweet");
			if (FramaLastTweet==undefined) { 
				mbcreateCookie("FramaLastTweet",this.created_at,5);
			} else if (FramaLastTweet != this.created_at) {
				//alert("nouveau tweet a "+this.created_at+". On peut changer l'icone twitter pour notifier l'utilisateur");
				
			}
		}
		var str = '	<div class="tweet">\
					<div class="time">'+relativeTime(this.created_at)+'</div>\
					<div class="txt">'+formatIdenticaString(this.text)+'</div>\
					</div>';
		
		container.append(str);
	
	});
	
	container.jScrollPane();
}


function TweetTickFriends(ob)
{
	var container=$('#tweet-container-friends');
	container.html('');
	
	$(ob.results).each(function(el){
	
		var str = '	<div class="tweet">\
					<div class="avatar"><a href="http://twitter.com/'+this.from_user+'" target="_blank"><img src="'+this.profile_image_url+'" alt="'+this.from_user+'" /></a></div>\
					<div class="user"><a href="http://twitter.com/'+this.from_user+'" target="_blank">'+this.from_user+'</a></div>\
					<div class="time">'+relativeTime(this.created_at)+'</div>\
					<div class="txt">'+formatTwitString(this.text)+'</div>\
					</div>';
		
		container.append(str);
	
	});
	
	container.jScrollPane();
}

function formatIdenticaString(str)
{
	str=' '+str;
	//str = str.replace(/((ftp|https?):\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?)/gm,'<a href="$1" target="_blank">$1</a>');
	//str = str.replace(/([^\w])\@([\w\-]+)/gm,'$1@<a href="http://identi.ca/$2" target="_blank">$2</a>');
	//str = str.replace(/([^\w])\#([\w\-]+)/gm,'$1<a href="http://identi.ca/search?q=%23$2" target="_blank">#$2</a>');
	//str = str.replace(/([^\w])\!([\w\-]+)/gm,'$1<a href="http://identi.ca/group/$2" target="_blank">#$2</a>');
	str = str.replace(/\srel=/gm,'target=&quot;blank&quot; rel=');
	return str;
}


function formatTwitString(str)
{
	str=' '+str;
	str = str.replace(/((ftp|https?):\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?)/gm,'<a href="$1" target="_blank">$1</a>');
	str = str.replace(/([^\w])\@([\w\-]+)/gm,'$1@<a href="http://twitter.com/$2" target="_blank">$2</a>');
	str = str.replace(/([^\w])\#([\w\-]+)/gm,'$1<a href="http://twitter.com/search?q=%23$2" target="_blank">#$2</a>');
	return str;
}

function relativeTime(pastTime)
{	
	var origStamp = Date.parse(pastTime);
	var curDate = new Date();
	var currentStamp = curDate.getTime();
	
	var difference = parseInt((currentStamp - origStamp)/1000);

	if(difference < 0) return false;

	if(difference <= 5)				return "A l'instant";
	if(difference <= 20)			return "Il y a quelques secondes";
	if(difference <= 60)			return "Il y a une minute";
	if(difference < 3600)			return "Il y a "+parseInt(difference/60)+" minutes";
	if(difference <= 1.5*3600) 		return "Il y a une heure";
	if(difference < 23.5*3600)		return "Il y a "+Math.round(difference/3600)+" heures";
	if(difference < 1.5*24*3600)	return "Hier";
	
	var dateArr = pastTime.split(' ');
	return dateArr[4].replace(/\:\d+$/,'')+' '+dateArr[2]+' '+dateArr[1]+(dateArr[3]!=curDate.getFullYear()?' '+dateArr[3]:'');
}

function mbcreateCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function mbreadCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function mberaseCookie(name) {
	createCookie(name,"",-1);
}

