const isHandWinning = (hand) => {
  for (let i = 0; i < hand.length; i++) {
    for (let j = i + 1; j < hand.length; j++) {
      for (let k = j + 1; k < hand.length; k++) {
        for (let l = k + 1; l < hand.length; l++) {
          if (areCardsSameValue(hand[i], hand[j], hand[k], hand[l]) || areCardsRun(hand[i], hand[j], hand[k], hand[l])) {
            let otherCards = hand.filter((card) => {
              return card !== hand[i] && card !== hand[j] && card !== hand[k] && card !== hand[l];
            });
            if (areCardsSameValue(...otherCards) || areCardsRun(...otherCards)) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
};

const areCardsSameValue = (...cards) => {
  return cards.reduce((acc, card, i) => (cards[i + 1] ? card.value === cards[i + 1].value && acc : acc), true);
};

const areCardsRun = (...cards) => {
  cards.sort((cardA, cardB) => {
    if (cardA.value < cardB.value) {
      return -1;
    }
    if (cardB.value < cardA.value) {
      return 1;
    }
    return 0;
  });
  if (cards[0].desc !== 'A') {
    return cards.reduce((acc, card, i) => (cards[i + 1] ? card.value === cards[i + 1].value - 1 && card.suit === cards[i + 1].suit && acc : acc), true);
  } else {
    let withAceAtValueOne = cards.reduce((acc, card, i) => (cards[i + 1] ? card.value === cards[i + 1].value - 1 && card.suit === cards[i + 1].suit && acc : acc), true);
    if (withAceAtValueOne) {
      return withAceAtValueOne;
    } else {
      cards[0] = Object.assign({}, cards[0]);
      cards[0].value = 14;
      cards.sort((cardA, cardB) => {
      if (cardA.value < cardB.value) {
        return -1;
      }
      if (cardB.value < cardA.value) {
        return 1;
      }
      return 0;
      });
      return cards.reduce((acc, card, i) => (cards[i + 1] ? card.value === cards[i + 1].value - 1 && card.suit === cards[i + 1].suit && acc : acc), true);
    }
  }
};

module.exports = { isHandWinning };