// https://gist.github.com/ncerminara/11257943
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_~",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\-\_\~]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
// this base64 is modified to be URL friendly and is NOT true base64


function urlParam( name ) // stackoverflow
{
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results==null){
		return null;
	}
	else{
		return results[1] || 0;
	}
}

var Players = { length: 0 }
if( urlParam( 'd' ) && urlParam( 'd' ) !== 0 )
{
	var param = urlParam( 'd' );
	param = Base64.decode( param );
	Players = JSON.parse( param );
	var count = 0;
	for( var v in Players )
	{
		count++;
	}
	Players.length = count;
}


function setParams( params )
{
	var url = window.location.href;
	var ind = url.indexOf( "?" );
	if( ind < 0 )
	{
		window.location.href += "?d=" + Base64.encode( JSON.stringify( params ) );
	}
	else
	{
		window.location.href = url.substring( 0, ind ) + "?d=" + Base64.encode( JSON.stringify( params ) );
	}
}
function saveParams()
{
	setParams( Players );
}

$.fn.addButton = function( text, callback, attribute )
{
	return this.append(
		$('<a>').attr( 'class', 'button' + ( attribute ? " " + attribute : "" ) ).html( text ).attr( 'href', 'javascript:' + callback + '()' )
	);
};
function comma(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function status( text )
{
	$('#status').text( text );
}



if( Players.length === 0 )
{
	$('#players').append( $('<li>').css( "text-align", "center" ).text( "NO PLAYERS!" ) );
	status( "Click \"Add Player\" at the bottom" );
}
else
{
	//<li><a href="">NAME<div class="right">MONEY</div></a></li>
	for( var name in Players )
	{
		if( name == 'length' )
			continue;

		var makeRed = Number( Players[name] ) < 0 || Players[name] === 'BANKRUPT';

		var money = Number( Players[ name ] );
		if( !money )
			money = "BANKRUPT";
		else
			money = '$' + comma( money );
		$("#players").append(
			$('<li>').append(
				$('<div>').attr( 'class', 'right' ).text(money).toggleClass( 'red', makeRed )
			).append(
				money === "BANKRUPT" ?
					$('<div>').text( name ) : 
					$('<a>').attr( 'href', 'javascript:selectPlayer("' + name.replace( /\\/g, '\\\\' ).replace( '"', '\\"' ) + '")' )
					.text(name)
			)
		);
	}

}
var inUse = false;

function cancelChanges()
{
	window.location.href = window.location.href;
}

// player adding
function addPlayer()
{
	if( inUse )
		return;
	inUse = true;
	status( "Enter the name of this player" );
	$("#controls").append(
		$('<input>').attr( 'type', 'text' ).attr( 'id', 'playerName' )
	).addButton('Submit', 'submitPlayer', 'green');
	$('#cancel').addButton(
		'Cancel', 'cancelChanges'
	);

}
function submitPlayer()
{
	var name = $('#playerName').val();
	if( name === "length" )
	{
		status( "Illegal player name. Please pick another." );
		return;
	}
	if( Players[ name ] !== undefined )
	{
		status( "Player name taken. Please pick another." );
		return;
	}
	Players[name] = 1500; // starting money
	saveParams();
}

var curPly;
var selectCallback;
// player actions
function selectPlayer( name )
{
	if( !Players[ name ] )
		return;
	var money = Players[name];

	if( !inUse )
	{
		inUse = true;
		curPly = name;
		status( 'What would you like to do with "' + name + '"?');
		$('#controls').addButton( 'Add Money from Bank', 'addMoney', 'green' )
			.addButton( 'Give GO Money', 'goMoney' )
			.addButton( 'Give Money to Bank', 'takeMoney', 'red')
			.addButton( 'Give Money to Player', 'spendMoney', 'red')
			.addButton( 'Make BANKRUPT', 'bankrupt', 'red');
		$('#cancel').addButton(
			'Cancel', 'cancelChanges'
		);

	}
	else if( selectCallback )
	{
		selectCallback( name );
	}

}

// money from bank
function addMoney()
{
	status( 'How much?' );
	$('#controls').html('').append(
		$('<input>').attr( 'type', 'text' ).attr( 'id', 'amount' )
	).addButton( 'Submit', 'addMoneyFinish', 'green' );
}
function addMoneyFinish()
{
	
}

// bankruptcy
var confirming = false;
function bankrupt()
{
	if( confirming )
	{
		Players[ curPly ] = "BANKRUPT";
		saveParams();
		return;
	}
	confirming = true;
	status( 'Are you SURE you want to make "' + curPly + '" bankrupt?' );
	$('#controls').html('').addButton( 'Yes', 'bankrupt', 'red' );
}

