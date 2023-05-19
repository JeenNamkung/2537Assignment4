let timerID = null;
let matchedCount = 0;
let flipCount = 0;
let cardCount = 0; // Make cardCount a global variable

const updateStats = () => {
	document.getElementById('totalPairs').innerText = 'Total Pairs: ' + cardCount / 2;
	document.getElementById('foundPairs').innerText = 'Found Pairs: ' + matchedCount;
	document.getElementById('remainingPairs').innerText = 'Remaining Pairs: ' + (cardCount / 2 - matchedCount);
	document.getElementById('flipCount').innerText = 'Flip Count: ' + flipCount;
};

const startTimer = (timeLeft) => { // add a parameter to startTimer
	document.getElementById('timer').innerText = 'Time: ' + timeLeft;

	timerID = setInterval(() => {
			timeLeft--;
			document.getElementById('timer').innerText = 'Time: ' + timeLeft;

			if (timeLeft <= 0) {
					clearInterval(timerID);
					alert('Time up! Game over.');
					// Clear the game board
					$('#game_grid').empty();
					// Reset the score
					document.getElementById('score').innerText = 'Score: 0';
			}
	}, 1000);
};

const resetGame = () => {
  clearInterval(timerID);
  matchedCount = 0;
  flipCount = 0;
  cardCount = 0;
  updateStats();
  $('#game_grid').empty();
  document.getElementById('score').innerText = 'Score: 0';
  location.reload(); // 페이지를 새로고침
};


const startGame = () => {
	if (timerID) {
		// If a timer is already running, clear it
		clearInterval(timerID);
	}

	$('#startButtonWrapper').addClass('hidden');

	matchedCount = 0; // Reset matched count when game starts
	flipCount = 0; // Reset flip count when game starts

	let timeLimit; // declare a new variable
	let columnCount;
	const selectedDifficulty = $('#difficultySelect').val();

	if (selectedDifficulty === 'easy') {
			cardCount = 6;
			columnCount = 3;
			timeLimit = 100; // set the time limit for easy mode
	} else if (selectedDifficulty === 'normal') {
			cardCount = 12;
			columnCount = 4;
			timeLimit = 200; // set the time limit for normal mode
	} else if (selectedDifficulty === 'hard') {
			cardCount = 24;
			columnCount = 6;
			timeLimit = 300; // set the time limit for hard mode
	}

	startTimer(timeLimit);

	updateStats(); // Call updateStats after defining cardCount

	$('#game_grid').css('grid-template-columns', `repeat(${columnCount}, 1fr)`);

	let randomPokemonIds = [];
	for (let i = 0; i < cardCount / 2; i++) {
		const randomId = Math.floor(Math.random() * 810) + 1;
		randomPokemonIds.push(randomId, randomId); // Add each ID twice to the array
	}

	// Shuffle the array
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

	let score = 0;
	document.getElementById('score').innerText = 'Score: ' + score;

	let firstCard = null;
	let secondCard = null;

	$('.card').on('click', function () {
		flipCount++; // Increase flip count when a card is flipped
		updateStats();
		const clickedCard = $(this);
		const frontFace = clickedCard.find('.front_face');

		// 이미 매칭된 카드인 경우 무시
		if (clickedCard.hasClass('matched')) {
			return;
		}

		// 같은 카드를 두 번 클릭한 경우 무시
		if (clickedCard.hasClass('flip')) {
			return;
		}

		clickedCard.addClass('flip');

		if (!firstCard) {
			// 첫 번째 카드 클릭
			firstCard = clickedCard;
		} else {
			// 두 번째 카드 클릭
			secondCard = clickedCard;

			// 일치하는 카드인지 확인
			if (firstCard.find('.front_face').attr('src') === secondCard.find('.front_face').attr('src')) {
				// 일치하는 경우
				firstCard.addClass('matched');
				secondCard.addClass('matched');

				matchedCount++; // Increase matched count when cards match
				updateStats(); // Update the stats when cards match

				// Check if all cards have been matched
				if (matchedCount === cardCount / 2) {
					clearInterval(timerID);
					// Add a short delay before showing the completion message
					setTimeout(() => {
							alert('Congratulations! You completed the game.');
					}, 500);
			}

				firstCard = null;
				secondCard = null;
			} else {
				// 일치하지 않는 경우
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
};

$(document).ready(setup);
