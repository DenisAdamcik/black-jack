let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let deck;
let canHit = true;

window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();

    // Add event listeners for the "Hit" and "Stay" buttons
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("deal").addEventListener("click", deal);

};

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
   // document.getElementById("dealer-sum").innerText = dealerSum;

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    //document.getElementById("your-sum").innerText = yourSum;
}
function drawCard(target) {
    const card = deck.pop(); // Draw a card from the deck
    const cardImg = createCardImage("./cards/" + card + ".png");
    const value = getValue(card);
    const aceCount = checkAce(card);

    if (target === "dealer-cards") {
        dealerSum += value;
        dealerAceCount += aceCount;
        reduceDealerAce(); // Reduce Aces for the dealer
    } else {
        yourSum += value;
        yourAceCount += aceCount;

        // If the drawn card is an Ace and adding 11 would exceed 21,
        // treat the Ace as 1 for each previous Ace that was counted as 11.
        while (yourSum > 21 && yourAceCount > 0) {
            yourSum -= 10;
            yourAceCount -= 1;
        }
    }

    document.getElementById(target).append(cardImg);

    // Update scores after appending the card
    updateScores();
}





function hit() {
    if (!canHit) {
        return;
    }

    drawCard("your-cards");

    // Moved the calculation of value and aceCount inside the hit function
    const card = document.getElementById("your-cards").lastChild;
    const value = getValue(card.src)-10;
    const aceCount = checkAce(card.src);

    yourSum += value;
    yourAceCount += aceCount;

    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
        stay();
    }

    updateScores();
}


function stay() {
    reduceDealerAce(); // Reduce Aces for the dealer

    canHit = false;

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        reduceDealerAce(); // Reduce Aces for the dealer
        document.getElementById("dealer-cards").append(cardImg);
    }

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
    } else if (dealerSum > 21) {
        message = "You win!";
    } else if (yourSum == dealerSum) {
        message = "Tie!";
    } else if (yourSum > dealerSum) {
        message = "You Win!";
    } else if (yourSum < dealerSum) {
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}
function deal() {
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    canHit = true;

    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("your-cards").innerHTML = "";

    startGame();
    updateScores();
}

function revealDealerCards() {
    const dealerCards = document.getElementById("dealer-cards").getElementsByTagName("img");
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCards[i].style.visibility = "visible";
    }
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}
function reduceDealerAce() {
    while (dealerSum > 21 && dealerAceCount > 0) {
        dealerSum -= 10;
        dealerAceCount -= 1;
    }
}

function createCardImage(src) {
    const cardImg = document.createElement("img");
    cardImg.src = src;
    return cardImg;
}
function updateScores() {
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
}
