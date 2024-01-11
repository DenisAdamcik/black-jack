// Function to generate a random integer in the range [min, max]
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const maxCards = 52;
const drawnCards = [];

// Function to display a card under the player's hand
const imagePath = "./PlayingCards/";

function displayCardUnderPlayerHand(cardNumber) {
    const imageUrl = imagePath + cardNumber + ".png";
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.style.backgroundImage = `url(${imageUrl})`;
    document.getElementById('player-hand').appendChild(cardElement);
}

function hit() {
    let newRandomCard;

    // Ensure the card is not repeated
    do {
        newRandomCard = getRandomNumber(1, maxCards);
    } while (drawnCards.includes(newRandomCard));

    drawnCards.push(newRandomCard);
    displayCardUnderPlayerHand(newRandomCard);

    // If all cards have been drawn, reset the drawnCards array
    if (drawnCards.length === maxCards) {
        drawnCards.length = 0;
    }
}

function deal() {
    // Disable the "Deal" button
    document.getElementById('deal-button').disabled = true;

    for (let i = 0; i < 4; i++) {
        let newRandomCard;

        // Ensure the card is not repeated
        do {
            newRandomCard = getRandomNumber(1, maxCards);
        } while (drawnCards.includes(newRandomCard));

        drawnCards.push(newRandomCard);
        displayCardUnderPlayerHand(newRandomCard);

        // If all cards have been drawn, reset the drawnCards array
        if (drawnCards.length === maxCards) {
            drawnCards.length = 0;
        }
    }

    // Enable the "Hit" button after dealing is complete
    document.getElementById('hit-button').disabled = false;
}

// Event listener for the "Deal" button
document.getElementById('deal-button').addEventListener('click', deal);

// Event listener for the "Hit" button
document.getElementById('hit-button').addEventListener('click', hit);
