let timerID = null;
let matchedCount = 0;
let flipCount = 0;
let cardCount = 0;
let score = 0;
let isChanceTime = false;
let timeLimit;

const updateStats = () => {
	document.getElementById('totalPairs').innerText = 'Total Pairs: ' + cardCount / 2;
	document.getElementById('foundPairs').innerText = 'Found Pairs: ' + matchedCount;
	document.getElementById('remainingPairs').innerText = 'Remaining Pairs: ' + (cardCount / 2 - matchedCount);
	document.getElementById('flipCount').innerText = 'Flip Count: ' + flipCount;
	document.getElementById('score').innerText = 'Score: ' + score;
};

const startChanceTime = () => {
	if (!isChanceTime) {
		isChanceTime = true;

		$('.card').not('.matched').addClass('flip');

		setTimeout(() => {
			$('.card').not('.matched').removeClass('flip');
			isChanceTime = false;
			document.getElementById('chanceTimeButton').style.display = 'none';
		}, 1000);
	}
};

const startTimer = () => {
	let startTime = new Date().getTime();

	timerID = setInterval(() => {
		let currentTime = new Date().getTime();
		let elapsedTime = currentTime - startTime;

		let seconds = Math.floor(elapsedTime / 1000);
		let remainingTime = timeLimit - seconds;
		document.getElementById('timer').innerText = 'Time: ' + seconds + '/' + timeLimit + ', Remaining: ' + remainingTime;

		if (seconds === Math.floor(timeLimit / 2)) {
			document.getElementById('chanceTimeButton').style.display = 'block';
		}

		if (seconds >= timeLimit) {
			clearInterval(timerID);
			alert('Time is up! Your score is ' + score + '. If you want to finish the game, please click OK.');
		}
	}, 1000);
};

const resetGame = () => {
	clearInterval(timerID);
	matchedCount = 0;
	flipCount = 0;
	cardCount = 0;
	score = 0;
	updateStats();
	$('#game_grid').empty();
	location.reload();
};

const startGame = () => {
	if (timerID) {
		clearInterval(timerID);
	}

	$('#startButtonWrapper').addClass('hidden');

	matchedCount = 0;
	flipCount = 0;
	score = 0;

	let columnCount;
	const selectedDifficulty = $('#difficultySelect').val();

	if (selectedDifficulty === 'easy') {
		cardCount = 6;
		columnCount = 3;
		timeLimit = cardCount * 5;
	} else if (selectedDifficulty === 'normal') {
		cardCount = 12;
		columnCount = 4;
		timeLimit = cardCount * 5;
	} else if (selectedDifficulty === 'hard') {
		cardCount = 24;
		columnCount = 6;
		timeLimit = cardCount * 5;
	}

	startTimer();
	updateStats();

	$('#game_grid').css('grid-template-columns', `repeat(${columnCount}, 1fr)`);

	let randomPokemonIds = [];
	for (let i = 0; i < cardCount / 2; i++) {
		const randomId = Math.floor(Math.random() * 810) + 1;
		randomPokemonIds.push(randomId, randomId);
	}

	randomPokemonIds.sort(() => Math.random() - 0.5);

	const cards = $('#game_grid');
	cards.empty();

	if (selectedDifficulty === 'normal') {
		cards.css('grid-template-columns', 'repeat(4, 1fr)');
	} else if (selectedDifficulty === 'hard') {
		cards.css('grid-template-columns', 'repeat(6, 1fr)');
	}

	for (let i = 0; i < cardCount; i++) {
		const card = $('<div class="card"></div>');
		const frontFace = $('<img class="front_face" alt="Pokemon">');
		const backFace = $('<img class="back_face" src="back.webp" alt="Card Back">');
		card.append(frontFace);
		card.append(backFace);
		cards.append(card);
	}

	let counter = 0;
	$('.card .front_face').each(function () {
		$.ajax({
			url: `https://pokeapi.co/api/v2/pokemon/${randomPokemonIds[counter]}/`,
			success: (data) => {
				const imageUrl = data.sprites.front_default;
				$(this).attr('src', imageUrl);
			},
			error: (xhr, status, error) => {
				console.error('Error retrieving Pokemon data:', error);
			},
		});
		counter++;
	});

	let firstCard = null;
	let secondCard = null;

	$('.card').on('click', function () {
		const clickedCard = $(this);

		if (clickedCard.hasClass('matched') || clickedCard.hasClass('flip')) {
			return;
		}

		flipCount++;
		updateStats();
		clickedCard.addClass('flip');

		if (!firstCard) {
			firstCard = clickedCard;
		} else {
			secondCard = clickedCard;

			if (firstCard.find('.front_face').attr('src') === secondCard.find('.front_face').attr('src')) {
				firstCard.addClass('matched');
				secondCard.addClass('matched');

				matchedCount++;
				score++;

				updateStats();

				if (matchedCount === cardCount / 2) {
					clearInterval(timerID);
					setTimeout(() => {
						alert('Congratulations! You completed the game.');
					}, 500);
				}

				firstCard = null;
				secondCard = null;
			} else {
				setTimeout(() => {
					firstCard.removeClass('flip');
					secondCard.removeClass('flip');

					firstCard = null;
					secondCard = null;
				}, 800);
			}
		}
	});
};

const setup = () => {
	$('#startButton').on('click', startGame);
	$('#resetButton').on('click', resetGame);
	$('#chanceTimeButton').on('click', startChanceTime);
	$('#chanceTimeButton').hide();
};

$(document).ready(setup);
