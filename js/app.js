let symbols = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],
	opened = [],
	match = 0,
	moves = 0,
	clicks = 0,
	$deck = jQuery('.deck'),
	$scorePanel = $('#score-panel'),
	$moveNum = $('.moves'),
	$ratingStars = $('i'),
	$restart = $('.restart'),
	timer;

//timer setup
let gameTimer = () => {
	let startTime = new Date().getTime();

	timer = setInterval(() => {
		let now = new Date().getTime();
		let elapsed = now - startTime;
		let minutes = Math.floor((elapsed % (1000 *60 *60))/ (1000*60));
		let seconds = Math.floor((elapsed % (1000 *60))/1000);
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		let currentTime = minutes+ ":" +seconds;
		$(".clock").text(currentTime)
	}, 750);
};


//start the game
let start = () => {
	let cards = shuffle(symbols);
	$deck.empty();
	match = 0;
	moves = 0;
	$moveNum.text('0');
	$ratingStars.removeClass('fa-star-o').addClass('fa-star');
		for (let i = 0; i <cards.length; i++) {
			$deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
		};
		addClkListener();
		$(".clock").text("0:00");
};


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Set Rating and Final Score
let setRating = (moves) => {
	let score = 3;
	if (moves <= 10) {
		$ratingStars.eq(3).removeClass('fa-star').addClass('fa-star-o');
		score = 3;
	} else if (moves >10 && moves <= 14) {
		$ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
		score = 2;
	} else {
		$ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
		score = 1;
	};
	return { score };
};

//End Game Popup
let endGame = (moves,score) => {
	let msg = score == 1 ? score + ' Star': score + ' Stars';
	swal({
		allowEscapeKey: false,
		allowOutsieClick: false,
		title: "Congratulations! You Won!",
		text: "With "+moves+" Moves and "+msg+"!",
		type: 'success',
		confirmButtonText: "Play Again!"
	}).then((isConfirm)=>{
		if (isConfirm) {
			clicks = 0;
			clearInterval(timer);
			start();
		}
	});
};

//card setup
let addClkListener = () => {
	$deck.find('.card:not(".match, .open")').bind('click', function(){
		clicks++;
		clicks == 1 ? gameTimer() :'';
		if ($('.show').length > 1) { return true; };
		let $this = $(this), card = $this.context.innerHTML;
		if ($this.hasClass('open')) { return true; };
		
		//check for match
		$this.addClass('open show');
			opened.push(card);
		if (opened.length > 1) {
			if (card === opened[0]) {
				$deck.find('.open').addClass('match animated infinite rubberBand');
				setTimeout(()=> {
					$deck.find('.match').removeClass('open show animated inifinte rubberBand');
				}, 800);
				match++;
			} else {
				$deck.find('.open').addClass('notmatch animated infinite wobble');
				setTimeout(()=> {
					$deck.find('.open').removeClass('animated infinite wobble');
				}, 800 / 1.5);
				setTimeout(()=> {
					$deck.find('.open').removeClass('open show notmatch animated infinite wobble');
				}, 800);
			}
			opened = [];
				moves++;
				setRating(moves);
				$moveNum.html(moves);
		}

		//End Game if all cards matched
		if (match ===8) {
			setRating(moves);
			let score = setRating(moves).score;
			setTimeout(()=> {
				endGame(moves, score);
			}, 500);
		}
	});
};

//Restart Popup
$restart.bind('click', ()=>{
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: "Are you sure?",
		text: "Your progress will be lost!",
		type: 'warning',
		showCancelButton: "true",
		confirmButtonText: "Yes, Restart Game"
	}).then((isConfirm)=> {
		if(isConfirm) {
			clicks = 0;
			clearInterval(timer);
			start();
		};
	});
});

//Start the Game
start();