// https://gist.github.com/ncerminara/11257943
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_~",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\-\_\~]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
// this base64 is modified to be URL friendly and is NOT true base64


function status( text )
{
	return $('#status').html( text );
}
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

	var KeepGoing = true;
	try
	{
		Players = JSON.parse( param );
	}
	catch( err )
	{
		KeepGoing = false;

		setTimeout( function()
		{
			status( status().html() + '<br><div class="red">Save data is corrupted or invalid. Sorry!</div>' );
		}, 500 );
		setTimeout( resetConfirm, 3000 );
	}
	if( KeepGoing )
	{
		var count = 0;
		for( var v in Players )
		{
			if( v === 'length' )
				continue;
			count++;
		}
		Players.length = count;
	}
}


function setParams( params )
{
	var url = window.location.href;
	var ind = url.indexOf( "?" );
	var str;
	if( typeof params == "object" )
		str = Base64.encode( JSON.stringify( params ) );
	else
		str = params;
	if( ind < 0 )
	{
		window.location.href += "?d=" + str;
	}
	else
	{
		window.location.href = url.substring( 0, ind ) + "?d=" + str;
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

$(document).ready( function()
{

	$('#ctrlDiv').hide();
});
$.fn.textWidth = function( text ){
	var html_org = $(this).html();
	var html_calc = '<span>' + text + '</span>';
	$(this).html(html_calc);
	var width = $(this).find('span:first').width();
	$(this).html(html_org);
	return width;
};
function horRule()
{
	$('#ctrlDiv').show();
}
// resetting
function reset()
{
	horRule();
	status( 'Are you SURE you want to reset? This game will NOT be saved!' );
	$('#controls').html('').addButton( 'RESET', 'resetConfirm', 'red' );
	$('#cancel').addButton(
		'Cancel', 'cancelChanges'
	);
}
function resetConfirm()
{
	window.location.href = window.location.href.substring( 0, window.location.href.indexOf( '?' ) );
}


if( Players.length === 0 )
{
	$('#players').append( $('<li>').css( "text-align", "center" ).text( "NO PLAYERS!" ) );
	status( "Click \"Add Player\" below" );
}
else
{
	//<li><a href="">NAME<div class="right">MONEY</div></a></li>
	var i = -1;
	for( var name in Players )
	{
		if( name == 'length' )
			continue;
		i++;
		var makeRed = Number( Players[name] ) < 0;

		var money = Number( Players[ name ] );
		money = '$' + comma( money );
		var retired = name.search( '\(RETIRED\)' ) !== -1;
		$("#players").append(
			$('<li>').append(
				$('<div>').attr( 'class', 'right' ).html('<span>' + money + '</span>').toggleClass( 'red', makeRed )
			).append(
				$('<a>').attr( 'href', 'javascript:selectPlayer("' + name.replace( /\\/g, '\\\\' ).replace( '"', '\\"' ) + '")' )
				.html('<span>' + name + '</span>').toggleClass( 'plyName', true ).toggleClass( 'red', retired )
			).attr( 'id', 'player' + i )
		);
		if( $('#player' + i ).textWidth( name ) > 300 )
		{
			$('#player' + i ).css( 'font-size', 36 );
		}
		if( $('#player' + i ).textWidth( name ) > 300 )
			$('#player' + i ).css( 'font-size', 24 );
	}

}
var inUse = false;

function cancelChanges()
{
	window.location.href = window.location.href;
}

if( Players.length >= 8 )
{
	$("#addPlayer").hide();
}
else if( Players.length == 0 )
{
	$('#removePlayer').hide();
}
var submitCallback;

// player adding/removing
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
	horRule();

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
	Players[name] = 10000; // starting money
	saveParams();
}

var removingPlayer;
var playerToRemove;
function removePlayer()
{
	if( inUse )
		return;
	inUse = true;
	removingPlayer = true;
	status( "Click the player you want to remove" );
	$('#controls').html('');
	$('#cancel').addButton(
		'Cancel', 'cancelChanges'
	);
	horRule();

}
var confirmingRemove;
function removePlayerFinish()
{
	if( confirmingRemove )
	{
		delete Players[ playerToRemove ];
		saveParams();
		return;
	}
	confirmingRemove = true;
	status( 'Are you SURE you want to remove "' + playerToRemove + '"?<br>(TIP: You can make a player retire by clicking their name)' );

	$('#controls').addButton( 'Yes', 'removePlayerFinish', 'green' );
}

var curPly;
var recipient;
var pickingPlayer;
var pickingBankruptPlayer;
// player actions
function selectPlayer( name )
{
	if( Players[ name ] === undefined )
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
			.addButton( 'Give Money to Player', 'spendMoney', 'red');
		if( name.search( '\(RETIRED\)' ) === -1 )
			$('#controls').addButton( 'RETIRE', 'retire', 'red');
		$('#cancel').addButton(
			'Cancel', 'cancelChanges'
		);
		horRule();

	}
	else if( pickingPlayer && name !== curPly )
	{
		recipient = name;
		spendMoneyNext();
	}
	else if( pickingBankruptPlayer && name !== curPly )
	{
		recipient = name;
		retireGive();
	}
	else if( removingPlayer )
	{
		playerToRemove = name;
		removePlayerFinish();
	}

}
function getAmount() // gets amount entered in amount textbox
{
	var Equation = $('#amount').val();
	Equation = Equation.replace( /[^\d\(\)\.\*\/+-]/g, '' );
	var Result = eval( Equation );
	if( Result === undefined )
	{
		status( 'Please enter a valid amount' );
		return -1;
	}
	return Math.max( 0, Result );
}
function canAfford( ply, amount )
{
	if( Players[ply] === "RETIRED" )
		return false;
	return Players[ply] >= amount;
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
	var money = getAmount();
	if( money < 0 )
		return;
	Players[ curPly ] += money;
	saveParams();
}




// go
function goMoney()
{
	Players[ curPly ] += 200;
	saveParams();
}





// give to bank
function takeMoney()
{
	status( 'How much?' );
	$('#controls').html('').append(
		$('<input>').attr( 'type', 'text' ).attr( 'id', 'amount' )
	).addButton( 'Submit', 'takeMoneyFinish', 'green' );
}
var oldAmount;
var override = false;
function takeMoneyFinish()
{
	var money;
	if( oldAmount )
		money = oldAmount;
	else
		money = getAmount();
	if( money < 0 )
		return;
	if( !canAfford( curPly, money ) && !override )
	{
		oldAmount = money;
		status( 'Giving this to the bank will put "' + curPly + '" in debt. Do you want to continue?');
		$('#controls').html('').addButton( 'Yes', 'takeMoneyFinish', 'green' );
		override = true;
		return;
	}
	Players[ curPly ] -= money;
	saveParams();
}




// giving to player
function spendMoney()
{
	status( 'Who will be getting this money? (pick in player list)' );
	pickingPlayer = true;
	$('#controls').html('');
}

function spendMoneyNext()
{
	status( 'How much will "' + curPly + '" be giving "' + recipient + '"?' );
	$('#controls').html('').append(
		$('<input>').attr( 'type', 'text' ).attr( 'id', 'amount' )
	).addButton( 'Submit', 'spendMoneyFinish', 'green' );
}

var overrideSpend = false;
function spendMoneyFinish()
{
	var money;
	if( oldAmount )
		money = oldAmount;
	else
		money = getAmount();
	if( money < 0 )
		return;
	if( !canAfford( curPly, money ) && !overrideSpend )
	{
		oldAmount = money;
		status( 'Giving this to "' + recipient + '" will put "' + curPly + '" in debt. Do you want to continue?');
		$('#controls').html('').addButton( 'Yes', 'spendMoneyFinish', 'green' );
		overrideSpend = true;
		return;
	}
	Players[ curPly ] -= money;
	Players[ recipient ] += money;
	saveParams();
}




// retiring
function retire()
{
		//Players[ curPly ] = "RETIRED";
		//saveParams();
	status( 'Are you SURE you want to make "' + curPly + '" retire?' );
	$('#controls').html('').addButton( 'Yes', 'retireFinish', 'red' );
}
function retireFinish()
{
	Players[ curPly + ' (RETIRED)' ] = Players[ curPly ];
	delete Players[curPly];
	saveParams();
}



function save()
{
	if( inUse )
		return;
	inUse = true;
	status( 'Copy the text in the text box and save it somewhere for future use. When you want to use it, click "Load Data" and paste the data.' );
	$('#controls').html('').append(
		$('<input>').attr( 'type', 'text' ).attr( 'id', 'saveData' )
	).addButton( 'Done', 'cancelChanges', 'green' );
	$('#saveData').val( urlParam( 'd' ) ).mouseover( function()
	{
		$(this).select();
	});
	horRule();
}
function load()
{
	if( inUse )
		return;
	inUse = true;
	status( 'Paste the save data in the box below, then click "Load"' );
	$('#controls').html('').append(
		$('<input>').attr( 'type', 'text' ).attr( 'id', 'saveData' )
	).addButton( 'Load', 'loadFinish', 'green' );
	$('#cancel').addButton(
		'Cancel', 'cancelChanges'
	);
	horRule();

}
function loadFinish()
{
	var data = $('#saveData').val();
	setParams( data );
}
