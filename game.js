let state = "Begin";
let firstClick;
let firstCardId;
let secondClick;
let secondCardId;
let players = 0;
let counter = 0;
let p1counter = 0;
let p2counter = 0;
let player1TrysNum = 0;
let player2TrysNum = 0;
let sumTrys = 0;
let currentPlayer;
let currentPlayerId;
let startTime;
let endTime;
let intSize;
let cards = [];
let trys;
let moves1 = 0;
let moves2 = 0;


$(document).ready(function() {
	// starts a new game
	// newGame();
	$("#player2span").hide();
	$("#NewGame").click(function(e) {
		e.preventDefault();
		// starts a new game
		NewGame();
	});
	$("#players").on("change", function() {
		players = $(this).val();
		if (players == 1) $("#player2span").hide();
		else $("#player2span").show();
	});
});

function NewGame() {
	InitGame();
	SetUpBoard();
	SetPlayers();
	$("#timer").timer('remove');
	$("#timer").timer();
	$("#status").val($("#player" + currentPlayerId).val() + " " + state);
	let st1 = $(".stars1");
	st1.empty().append('<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>');
	let st2 = $(".stars2");
	st2.empty().append('<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>');
	$(".card").on("click", function() {
		//  values from the clicked elements
		let id = $(this).attr('id');
		let text = $(this).attr("val");
		//  data processing
		CheckState(text, id);
	});
}

function SetPlayers() {
	if (players == 2) {
		currentPlayerId = Math.floor(Math.random() * 2) + 1;
	} else {
		currentPlayerId = 1;
	}
	p1counter = p2counter = 0
	$("#player1score").val(p1counter);
	$("#player2score").val(p2counter);
	player1 = $("#player1").val();
	player2 = $("#player2").val();
}

function InitGame() {
	cards = [];
	state = "Begin";
	$size = $("#size").val();
	moves1 = 0;                     
	
	
	moves2 = 0;

	$('.moves1').html(moves1); 
	$('.moves2').html(moves2); 	
		
	intSize = parseInt($size);
	// Setup initial set of cards
	// We devide selected size by two to get number of card pairs
	// create loop from one to number of pairs and each time add pair of card values
	for (let initValues = 1; initValues <= intSize / 2; initValues++) {
		cards.push(initValues);
		cards.push(initValues);
	}
	console.log(cards);
}

function SetUpBoard() {
	$board = $("#board");
	$board.empty();
	// alert(intSize);
	if (intSize == 8) {
		$board.css("width", "100%").css("height", "100%");
	} else {
		$board.css("width", "100%").css("height", "100%");
	}
	//let cards = [1, 1, 2, 2, 3, 3, 4, 4];
	//	Shuffle cards
	cards = Shuffle(cards);
	// Add cards to the board
	for (let ca = 1, l = cards.length; ca <= l; ca++) {
		$board.append('<div id="' + ca + '" class="card"></div>');
		$("#" + (ca)).attr("val", cards[ca - 1]).removeClass().addClass("card");
	}
}

function CheckState(text, id) {
	if (state == "Begin") {
		state = "FirstClick";
		startTime = new Date().getTime();
	}
	switch (state) {
		case "FirstClick":
			firstClick = text;
			firstCardId = id;
			$("#" + id).addClass("a" + text);
			break;
		case "SecondClick":
			secondClick = text;
			secondCardId = id;
			EndGameTurn(id, text);
			break;
		default:
			break;
	}
	if (state == "FirstClick") {
		state = "SecondClick";
	} else if (state == "SecondClick") {
		state = "FirstClick";
	}
}

function EndGameTurn(id, text) {
		$("#" + id).addClass("a" + text).delay(1000).queue(function() {
		if (!CheckCards(text)) {
			$(this).removeClass("a" + text);
		}
		sumTrys++;


		if (counter == intSize / 2) {
			// End Game
			EndGame();
		}
		$(this).dequeue();
	});

}

//end game statistics and pop-up
function EndGame() {
	endTime = new Date().getTime();
	let time = (endTime - startTime) / 1000;
	let winner;
	let message;
	let winnerId;
	$('#timer').timer('pause');
	let showMoves;
	if (p1counter > p2counter) {
		winner = player1;
		trys = player1TrysNum;
		winnerId = 1;
		message = player1 + " wins in " + moves1 + " moves!!!";
		showMoves = moves1;
	} else if (p1counter < p2counter) {
		winner = player2;
		trys = player2TrysNum;
		winnerId = 2;
		showMoves = moves2;
		message = player2 + " wins in " + moves2 + " moves!!!";
	} else {
		trys = "!";
		message = winner = "Game drawn!!!";
		showMoves = moves1 + moves2;
	}
	$("#status").val(message);
	let wstars = $(".stars" + winnerId);
	let modal = "Game over!!!  Done in " + time + " seconds. Winner:" + winner + "   get " + wstars.children().length + " stars!!!" + "<br>" + " Won in " + showMoves + " moves!!!<br>" + "<br>" + "PLAY AGAIN?";
	$("#modal").html(modal).css("display", "block")
		//.show()  
		.delay(6000).queue(function() {
			$(this).css("display", "none");
			$(this).dequeue();
		});
	counter = 0;
	p1counter = 0;
	p2counter = 0;
	player1TrysNum = 0;
	player2TrysNum = 0;
}

function SetStars() {
	let starsNum ;
	if (currentPlayerId == 1) {
		trys = player1TrysNum;
	} else {
		trys = player2TrysNum;
	}
	let pairs = intSize / 2;
	if (trys <= pairs) {
		starsNum = 3
	} else if (trys <= pairs + 2) {
		starsNum = 2;
	} else starsNum = 1;
	let stars = $(".stars" + currentPlayerId);
	stars.empty();
	for (let c = 1; c <= starsNum; c++) {
		stars.append('<li><i class="fa fa-star"></i></li>');
	}
}

function CheckCards(text) {
	// let ret: return value, boolean
	let ret = firstClick === secondClick;
	if (currentPlayerId == 1) {
		
		player1TrysNum++;
		moves1++;
	} else {
		player2TrysNum++;
		moves2++;  
	}
	// star settings
	SetStars();
	if (ret) {
		counter++;
		if (currentPlayerId == 1) {
			p1counter++;
			$("#player1score").val(p1counter);		
		} else {
			p2counter++;
			$("#player2score").val(p2counter);
		}
		AddLightClasss();
	} else {
		console.log("Remove");
		RemoveSpecificClass(text);
		SwitchPlayers();
	}
	$('.moves1').html(moves1); 
	$('.moves2').html(moves2);
	state = "FirstClick";
	firstClick = "";
	firstCardId = "";
	SecondClick = "";
	secondCardId = "";
	return ret;
}

//player switch
function SwitchPlayers() {
	if ($("#players").val() == 2) {
		if (currentPlayerId == 1) {
			currentPlayerId = 2;
			currentPlayer = $("#player2").val();
		} else {
			currentPlayerId = 1;
			currentPlayer = $("#player1").val();
		}
	}
	$("#status").val(currentPlayer + " play");
}

function AddLightClasss() {
	$("#" + firstCardId).addClass("matched");
	$("#" + secondCardId).addClass("matched");
}

function RemoveSpecificClass() {
	$("#" + firstCardId).removeClass("a" + firstClick);
	$("#" + secondCardId).removeClass("a" + secondClick);
}

function Shuffle(arra1) {
	let ctr = arra1.length,
		temp, index;
	// While there are elements in the array
	while (ctr > 0) {
		// Pick a random index
		index = Math.floor(Math.random() * ctr);
		// Decrease ctr by 1
		ctr--;
		// And swap the last element with it
		temp = arra1[ctr];
		arra1[ctr] = arra1[index];
		arra1[index] = temp;
	}
	return arra1;
}


