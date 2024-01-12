function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const maxCards = 52;
let drawnCards = [];

const imagePath = "./PlayingCards/";

function displayCardUnderHand(cardNumber, handId) {
    const imageUrl = imagePath + cardNumber + ".png";
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.style.backgroundImage = `url(${imageUrl})`;
    document.getElementById(handId).appendChild(cardElement);
}

function hit(handId) {
    let newRandomCard;

    do {
        newRandomCard = getRandomNumber(1, maxCards);
    } while (drawnCards.includes(newRandomCard));

    drawnCards.push(newRandomCard);
    displayCardUnderHand(newRandomCard, handId);

    if (drawnCards.length === maxCards) {
        drawnCards = [];
    }
}

function deal() {
    document.getElementById('deal-button').disabled = true;

    hit('player-hand');
    hit('dealer-hand');
    hit('player-hand');
    hit('dealer-hand');

    document.getElementById('hit-button').disabled = false;
}

function dealerTurn() {
    // Dealer hits until the hand is at least 17 or the dealer's hand beats the player's hand
    while (calculateHandValue('dealer-hand') < 17 || calculateHandValue('player-hand') < calculateHandValue('dealer-hand')) {
        hit('dealer-hand');
    }

    determineWinner();
}

function calculateHandValue(handId) {
    const handElements = document.getElementById(handId).getElementsByClassName('card');
    let handValue = 0;
    let numAces = 0;

    for (let i = 0; i < handElements.length; i++) {
        const imageUrl = handElements[i].style.backgroundImage;
        const cardNumber = parseInt(imageUrl.match(/\d+/)[0]);

        if (cardNumber >= 2 && cardNumber <= 10) {
            handValue += cardNumber;
        } else if (cardNumber >= 11 && cardNumber <= 13) {
            handValue += 10; // Face cards value as 10
        } else if (cardNumber === 1) {
            handValue += 11; // Ace initially counts as 11
            numAces += 1;
        }
    }

    // Adjust Ace value from 11 to 1 if needed
    while (handValue > 21 && numAces > 0) {
        handValue -= 10;
        numAces -= 1;
    }

    return handValue;
}

const winnerDisplay = document.createElement('div');
document.body.appendChild(winnerDisplay);

function determineWinner() {
    const playerHandValue = calculateHandValue('player-hand');
    const dealerHandValue = calculateHandValue('dealer-hand');

    if (playerHandValue > 21 || (dealerHandValue <= 21 && dealerHandValue > playerHandValue)) {
        winnerDisplay.textContent = 'Dealer wins!';
    } else if (dealerHandValue > 21 || (playerHandValue <= 21 && playerHandValue > dealerHandValue)) {
        winnerDisplay.textContent = 'Player wins!';
    } else {
        winnerDisplay.textContent = 'It\'s a tie!';
    }

    document.getElementById('deal-button').disabled = false;
}

document.getElementById('deal-button').addEventListener('click', deal);
document.getElementById('hit-button').addEventListener('click', function () {
    hit('player-hand');
    if (calculateHandValue('player-hand') > 21) {
        alert('Player busts! Dealer wins.');
        document.getElementById('deal-button').disabled = false;
        document.getElementById('hit-button').disabled = true;
    } else {
        dealerTurn();
    }
});
