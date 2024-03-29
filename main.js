let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let deck;
let canHit = true;
//Po spusteni stranky se nactou funkce a tlačitka
window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();
    updateScores();
    blackJack();
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("deal").addEventListener("click", deal);
};
//spoji hodnoty karet a typy karet do formatu cislo-typ
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
//nahodne promicha karty
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}
//razda 2 karty dealerovi 2 karty a hraci 2 karty
function startGame() {
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
}
//vybere prvni kartu v balicku a vytvoři kartu a zaroven skontroluje jestly je to eso 
function drawCard(target) {
    const card = deck.pop();
    const cardImg = createCardImage("./cards/" + card + ".png");
    const value = getValue(card);
    const aceCount = checkAce(card);

    if (target === "dealer-cards") {
        dealerSum += value;
        dealerAceCount += aceCount;
        reduceDealerAce();
    } else {
        yourSum += value;
        yourAceCount += aceCount;

        while (yourSum > 21 && yourAceCount > 0) {
            yourSum -= 10;
            yourAceCount -= 1;
        }
    }

    document.getElementById(target).append(cardImg);
    updateScores();
}
//funkce pro hrace kdyz chce pridat kartu, ale kdyz hodnota karet prekroci 21 zastavi ho to a umožni dealerovy hrat
function hit() {
    if (!canHit) {
        return;
    }

    drawCard("your-cards");

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
//hrac je spokojen s jeho karty a nechava hrat dealera 
function stay() {
    reduceDealerAce();
    canHit = false;

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        reduceDealerAce();
        document.getElementById("dealer-cards").append(cardImg);
    }
// vyhodnoceni hry a nadefinovani promene pro text
    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
    } else if (dealerSum > 21) {
        message = "You win!";
    } else if (yourSum == dealerSum ) {
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
//kotroluje zda hrac ma blackjack na zacatku hry
function blackJack(){
    if(yourSum==21){
        stay();
        document.getElementById("blackjack").innerText = "BlackJack";
    }
}
//resetuje promene a zacne hru od zacatku
function deal() {
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    canHit = true;

    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("your-cards").innerHTML = "";
    document.getElementById("results").innerText = "";

    // Check if there are fewer than 10 cards remaining in the deck
    if (deck.length < 10) {
        // If so, reshuffle the deck
        buildDeck();
        shuffleDeck();
    }

    startGame();
    updateScores();
}


/*function revealDealerCards() {
    const dealerCards = document.getElementById("dealer-cards").getElementsByTagName("img");
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCards[i].style.visibility = "visible";
    }
}
*/
// rozdeli jmeno carty na hodnotu a typ, kdyz karta neni cislo se rovná 10 nebo 11
function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
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
