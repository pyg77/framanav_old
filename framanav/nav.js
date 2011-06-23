/* nav.js par pyg@framasoft.net pour Framasoft
Contient les divers appels aux scripts nécéssaires pour la Framanav */

$(document).ready(function(){
	
	// on  fait bliker le logo "faire un don" en bas à droite
	p_donationsTimer(false); 
	
	//on recupère le nom de domaine actuel
	var navdomain=document.domain;
	navdomain = navdomain.replace(/^(www|test)\./i, "");
	navdomain = navdomain.replace(/\.(com|net|org)$/i, "");
	$('#framalinks li[rel='+navdomain+']').addClass('nav-active'); // on active la couleur spécifique pour le domaine
	
	// récupération du flux RSS et affichage dans #fluxRSS
	$('#fluxRSS').rssfeed('http://framapack.org/~framaflux/framanav_rss.php', {
			limit: 10,
			header: false,
			titletag: 'div',
			date: false,
			content: false,
			snippet: false,
			showerror: true,
			zcss: 'rssFeed',
			truncateTitle: 65,
			truncateContent: 300,
			errormsg: ''}).ajaxStop(function() {
		$('#fluxRSS div.rssBody').vTicker({ showItems: 1});
	});
	
$("#head-search input.textarea").focusin(function() {
	$(this).animate({width: "160px", left: "20px"}, 500,
		function() {if (this.value=='Rechercher sur Framasoft') this.value='';});
});
$("#head-search input.textarea").focusout(function() {
	if (this.value=='') this.value='Rechercher sur Framasoft';
	$(this).animate({width: "80px", left: "100px"}, 500);
});

// Patch pour IE 7 et 8 pour garder la newsletter affichée
if (navigator.userAgent.toLowerCase().search("msie 7") > -1 || navigator.userAgent.toLowerCase().search("msie 8") > -1) {
	$("#framanav ul#framalinks li.ltip.newsletter").mouseenter(function() {$("#framanav ul#framalinks li.ltip.newsletter > div").show()});
	$("a[rel=newsletter]").click(function() {$("#framanav ul#framalinks li.ltip.newsletter > div").toggle()});
	$('#framanav ul#framalinks li.ltip a[rel!="newsletter"]').mouseenter(function() {$("#framanav ul#framalinks li.ltip.newsletter > div").hide()});
};
// 

$("#newsletter input.textarea").focusin(function() {if (this.value=='votre.adresse@email.org') this.value='';});
$("#newsletter input.textarea").focusout(function() {if (this.value=='') this.value='votre.adresse@email.org';});
$("#newsletter input.textarea").keypress(function() {
	if (this.value!='' && this.value!='votre.adresse@email.org') {
		if (p_isValidEmail(this.value)) {
			$("#checkmail").css("background-position", "-100px -114px");
		} else {
			$("#checkmail").css("background-position", "-100px -96px");
		}
	} else {
		$("#checkmail").css("background-position", "-115px -60px");
	}
});

/*************** Début Fenêtres modales ***************
 * http://sohtanaka.developpez.com/tutoriels/javascript/creez-fenetre-modale-avec-css-et-jquery/
 ******************************************************/
	
//Lorsque vous cliquez sur un lien de la classe poplight et que le href commence par #
$('a.poplight[href^=#]').click(function() {
	var popID = $(this).attr('rel'); //Trouver la pop-up correspondante
	var popURL = $(this).attr('href'); //Retrouver la largeur dans le href

	//Récupérer les variables depuis le lien
	var query= popURL.split('?');
	var dim= query[1].split('&');
	var popWidth = dim[0].split('=')[1]; //La première valeur du lien

	//Faire apparaitre la pop-up et ajouter le bouton de fermeture
	$('#' + popID).fadeIn().css({ 'width': Number( popWidth ) }).prepend('<a href="#" class="close"><div class="btn_close"></div></a>');

	//Récupération du margin, qui permettra de centrer la fenêtre - on ajuste de 80px en conformité avec le CSS
	var popMargTop = ($('#' + popID).height() + 80) / 2;
	var popMargLeft = ($('#' + popID).width() + 80) / 2;

	//On affecte le margin
	$('#' + popID).css({
		'margin-top' : -popMargTop,
		'margin-left' : -popMargLeft
	});

	//Effet fade-in du fond opaque
	$('body').append('<div id="fade"></div>'); //Ajout du fond opaque noir
	//Apparition du fond - .css({'filter' : 'alpha(opacity=80)'}) pour corriger les bogues de IE
	$('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn();

	return false;
});

//Fermeture de la pop-up et du fond
$('a.close, #fade').live('click', function() { //Au clic sur le bouton ou sur le calque...
	$('#fade , .popup_block').fadeOut(function() {
		$('#fade, a.close').remove();  //...ils disparaissent ensemble
	});
	return false;
});

/**************** Fin du script Fenêtres modales ****************/
// Charge l'iframe Microblog en js à cause du script interne qui n'affiche pas les tweets.
$('#framalinks li.microblog .poplight').click(function() {
	$('#microblog > div').html('<iframe src="http://nav.framasoft.org//framanav/microblog/index.html?1" width="710" height="380" frameBorder="no"></iframe>');
});
// Idem avec Informations pour éviter de précharger le contenu de l'iframe
$('#framalinks li.info .poplight').click(function() {
	$('#informations > div').html('<iframe src="http://nav.framasoft.org/framanav/framareseau/" width="710" height="380" frameBorder="no" SCROLLING="NO"></iframe>');
});
// Charge les flux rss en js
$('#framalinks li.rss .poplight').click(function() {
	$('#fullFeed').rssfeed(
		'http://framapack.org/~framaflux/rss.php', {
			limit: 50,
			header: false,
			titletag: 'div',
			date: false,
			content: false,
			snippet: false,
			showerror: true,
			truncateContent: 500,
			zcss: 'rssFullFeed',
			addDomain: true,
			errormsg: ''
		}
	);
});
/**************** Fin du paramétrage des fenêtres modales ****************/

	$('#framalinks li.ltip a, #donation').click(function() {
	  attr = $(this).attr("rel");
	  if (typeof(_gaq) != 'undefined') _gaq.push(['_trackEvent', 'Framanav', 'Click', attr]);
	});

  // on masque les éléments "framalinks", "dons" et "recherche" si la résolution est trop faible
  // à paramétrer dans la fonction p_adaptNavWidth() en bas
  p_adaptNavWidth(0); // au chargement
  $('.rss_pause a').click(function(){p_adaptNavWidth(1000)}); // au clic sur le bouton pause
  $(window).resize(	function () {
		p_adaptNavWidth(1000) // au redimensionnement
	}
  )
}); 

/**
 * Plugin: jquery.zRSSFeed
 * 
 * Version: 1.0.1
 * (c) Copyright 2010, Zazar Ltd
 * 
 * Description: jQuery plugin for display of RSS feeds via Google Feed API
 *              (Based on original plugin jGFeed by jQuery HowTo)
 * 
 * History:
 * 1.0.1 - Corrected issue with multiple instances
 *
 **/

(function($){

	var current = null; 
	
	$.fn.rssfeed = function(url, options) {	
	
		// Set pluign defaults
		var defaults = {
			limit: 10,
			header: true,
			titletag: 'h4',
			date: true,
			content: true,
			snippet: true,
			showerror: true,
			errormsg: '',
			zcss: 'rssFeed', // ajouté par pyg
			truncateTitle: 650,
			truncateContent: 3000,
			addDomain: false,
			key: null
		};  
		var options = $.extend(defaults, options); 
		
		// Functions
		return this.each(function(i, e) {
			var $e = $(e);
			
			// Add feed class to user div
			if (!$e.hasClass(options.zcss)) $e.addClass(options.zcss); // modifié par pyg
			
			// Check for valid url
			if(url == null) return false;

			// Create Google Feed API address
			var api = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + url;
			if (options.limit != null) api += "&num=" + options.limit;
			if (options.key != null) api += "&key=" + options.key;

			// Send request
			$.getJSON(api, function(data){
				
				// Check for error
				if (data.responseStatus == 200) {
	
					// Process the feeds
					_callback(e, data.responseData.feed, options);
				} else {

					// Handle error if required
					if (options.showerror)
						if (options.errormsg != '') {
							var msg = options.errormsg;
						} else {
							var msg = data.responseDetails;
						};
						$(e).html('<div class="rssError"><p>'+ msg +'</p></div>');
				};
			});				
		});
	};
	
	// Callback function to create HTML result
	var _callback = function(e, feeds, options) {
		if (!feeds) {
			return false;
		}
		var html = '';	
		var row = 'odd';	
		
		// Add header if required
		if (options.header)
			html +=	'<div class="rssHeader">' +
				'<a href="'+feeds.link+'" title="'+ feeds.description +'">'+ feeds.title +'</a>' +
				'</div>';
			
		// Add body
		html += '<div class="rssBody">' +
			'<ul>';
		
		// Add feeds
		for (var i=0; i<feeds.entries.length; i++) {
			
			// Get individual feed
			var entry = feeds.entries[i];
			
			// Format published date
			var entryDate = new Date(entry.publishedDate);
			var pubDate = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString();
			
			// Add feed row
			var summary = "";
			if (rssTruncate(entry.content) != "") { summary = '<br /><span class="summary">'+ rssTruncate(entry.content, options.truncateContent) +'</span>'; }
			
			var transformContent = "";
			transformContent += options.addDomain ? p_GetFeedDomain(entry.link) : "";
			transformContent += rssTruncate(entry.title, options.truncateTitle );
			transformContent += summary;
			
			html += '<li class="rssRow '+row+'">'
			
			html += '<a href="'+ entry.link +'" class="tip" target="_blank">'+ transformContent +'</a>' //modifié par pyg
			if (options.date) html += '<div>'+ pubDate +'</div>'
			if (options.content) {
			
				// Use feed snippet if available and optioned
				if (options.snippet && entry.contentSnippet != '') {
					var content = entry.contentSnippet;
				} else {
					var content = entry.content;
				}
				
				html += '<p>'+ content +'</p>'
			}
			
			html += '</li>';
			
			// Alternate row classes
			if (row == 'odd') {
				row = 'even';
			} else {
				row = 'odd';
			}			
		}
		
		html += '</ul>' +
			'</div>'
		
		$(e).html(html);
	};
})(jQuery);
 

/*
* Tadas Juozapaitis ( kasp3rito@gmail.com )
*/
(function($){
$.fn.vTicker = function(options) {
	var defaults = {
		speed: 700,
		pause: 4000,
		showItems: 1,
		animation: '',
		height: 1,
		mousePause: true,
		isPaused: false
	};

	var options = $.extend(defaults, options);

	moveUp = function(obj2, height){
		if(options.isPaused)
			return;
		
		var obj = obj2.children('ul');
		
    	first = obj.children('li:first').clone(true);
		
    	obj.animate({top: '-=' + height + 'px'}, options.speed, function() {
        	$(this).children('li:first').remove();
        	$(this).css('top', '0px');
        });
		
		if(options.animation == 'fade')
		{
			obj.children('li:first').fadeOut(options.speed);
			obj.children('li:last').hide().fadeIn(options.speed);
		}

    	first.appendTo(obj);
	};
	
	return this.each(function() {
		var obj = $(this);
		var maxHeight = 0;

		obj.css({overflow: 'hidden', position: 'relative'})
			.children('ul').css({position: 'relative', margin: 0, padding: 0}) //modifié par pyg pour IE (avant : position: 'absolute')
			.children('li').css({margin: 0, padding: 0});

		obj.children('ul').children('li').each(function(){
			if($(this).height() > maxHeight)
			{
				maxHeight = $(this).height();
			}
		});

		obj.children('ul').children('li').each(function(){
			$(this).height(maxHeight);
		});

		obj.height(maxHeight * options.showItems);
		
    	var interval = setInterval(function(){ moveUp(obj, maxHeight); }, options.pause);
		
		if(options.mousePause)
		{
			obj.bind("mouseenter",function(){
				options.isPaused = true;
			}).bind("mouseleave",function(){
				options.isPaused = false;
			});
		}
	});
};
})(jQuery);

/**
* jQuery Cookie plugin
*
* Copyright (c) 2010 Klaus Hartl (stilbuero.de)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
* 
* https://github.com/carhartl/jquery-cookie
*/
jQuery.cookie = function (key, value, options) {
    
    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }
        
        value = String(value);
        
        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

/***********************
 *  fonctions perso    *
 ***********************/
 
 var truncate = function (str, limit) {
	var bits, i;

	bits = str.split('');
	if (bits.length > limit) {
		for (i = bits.length - 1; i > -1; --i) {
			if (i > limit) {
				bits.length = i;
			}
			else if (' ' === bits[i]) {
				bits.length = i;
				break;
			}
		}
		bits.push('...');
	}
	return bits.join('');
};
 
 function rssTruncate(data, length) { 
 data = data.replace(/<\/?[^>]+>/gi, ''); 
 data = truncate(data, length);
 return jQuery.trim(data);
 
 };
 
 
function p_maxHeight() {
	if ($(window).height()<600) return 600
	return $(window).height();
}

function navreadCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

// Fonction afficher le framalinks dans la nav ou dans Plus selon la largeur de la fenêtre
function j_movelink(framalink,size,time, wWidth) {
	if ($('li[rel="'+framalink+'"]').length < 2) { // Copie des framalinks dans Plus
		$('li[rel="'+framalink+'"]').clone().prependTo('li.others ul');
	}
	if (wWidth < size ) { // size, c'est la borne à ne pas dépasser 
		$('#framalinks > li[rel="'+framalink+'"]').fadeOut(time); // sinon on efface le framalink de la nav 
		$('li.others ul li[rel="'+framalink+'"]').show(); // et on affiche celui dans Plus
	} else {
		$('#framalinks > li[rel="'+framalink+'"]').fadeIn(time); // et inversement
		$('li.others ul li[rel="'+framalink+'"]').hide();
	}
}

// bouton pour stoper le défilement du flux RSS
function rssPause() { // met en pause (affiche le bouton play)
	$('#fluxRSS div.rssBody').toggle ('slow');
	$('#fluxRSS').hide(); $('.fluxrss').width("30px");
	$.cookie('framanavrss', 'hidden', { expires: 365, path: '/', domain: '.'+document.domain.replace(/^(www|test)\./i, ""), secure: false });
	$('.rss_pause > a').css('background-position','-100px -60px');
}
function rssPlay() { // play (affiche le bouton pause)
	$('#fluxRSS div.rssBody').toggle ('slow');
	$('#fluxRSS').show(); $('.fluxrss').width("420px"); // La largeur est aussi dans le CSS
	$.cookie('framanavrss', 'visible', { expires: 365, path: '/', domain: '.'+document.domain.replace(/^(www|test)\./i, ""), secure: false });
	$('.rss_pause > a').css('background-position','-100px -78px');
}

function p_adaptNavWidth(time) {
	var wWidth = $(window).width(); // passage de la largeur de la fenêtre dans une variable (pour alléger)
	if($.cookie('framanavrss')=="hidden") { // Si pas de flux RSS 420px de moins
		j_movelink("forum.framasoft", 1080, time, wWidth);
		
		j_movelink("framabook", 980, time, wWidth);
		j_movelink("enventelibre", 880, time, wWidth);
		(wWidth < 780) ? $('#framanav .dons').fadeOut(time) : $('#framanav .dons').fadeIn(time);
		j_movelink("framakey", 680, time, wWidth);
		j_movelink("framablog", 580, time, wWidth);
		j_movelink("framasoft", 480, time, wWidth);
		
		$('.rss_pause a').toggle(function () {rssPlay()},function() {rssPause()});
		rssPause();
	} else {
		j_movelink("forum.framasoft", 1450, time, wWidth);
		j_movelink("framabook", 1350, time, wWidth);
		(wWidth < 1250) ? $('.fluxrss').fadeOut(time) : $('.fluxrss').fadeIn(time);
		if (wWidth < 1250) $('.rssFeed').css({'width': '400px'});
		j_movelink("enventelibre", 880, time, wWidth);
		(wWidth < 780) ? $('#framanav .dons').fadeOut(time) : $('#framanav .dons').fadeIn(time);
		j_movelink("framakey", 680, time, wWidth);
		j_movelink("framablog", 580, time, wWidth);
		j_movelink("framasoft", 480, time, wWidth);
		$('.rssFeed').css('width', function() {
			return wWidth / 3.5;
		});
		
		$('.rss_pause a').toggle(function () {rssPause()},function() {rssPlay()});
		rssPlay();
	}
}

function p_GetFeedDomain(link) {
	if (link.match(/framablog\.org/i)) return '<span class="domain">Framablog </span>';
	if (link.match(/forum.framasoft\.org/i)) return '<span class="domain">Framagora </span>';
	if (link.match(/blip\.tv/i)) return '<span class="domain">Framatube </span>';
	if (link.match(/agendadulibre\.org/i)) return '<span class="domain">Agenda </span>';
	if (link.match(/(identi\.ca|twitter)/i)) return '<span class="domain">Identi.ca </span>';
	if (link.match(/(www\.|http:\/\/)framasoft\.(org|net)/i)) return '<span class="domain">Framasoft </span>';
	return "";
}

function p_isValidEmail(emailAddress) {
var pattern = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  //return pattern.test(emailAddress);
  if (pattern.test(emailAddress)==true) {
  	//alert('On abonne '+emailAddress)
	return true;
  } else {
	return false;
  }
}

function p_donationsTimer(t) {
	if (t) $('#donation').fadeOut(600).fadeIn(600);
	t = 30000 + Math.floor(Math.random()*30000); // random entre 30 et 60s
	setTimeout('p_donationsTimer(1)',t);
}
