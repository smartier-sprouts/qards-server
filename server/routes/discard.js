'use strict';
const express = require('express');
const router = express.Router();
const { findGame, updateGame } = require('../../db/helpers');
const { isHandWinning } = require('./isHandWinning');

// let withAceAtValueOne;


// const areCardsSameValue = (...cards) => {
//   console.log('in areCardsSameValue');
//   return cards.reduce((acc, card, i) => (cards[i + 1] ? card.value === cards[i + 1].value && acc : acc), true);
// };

// const areCardsRun = (...cards) => {
//   console.log('in areCardsRun');
//   cards.sort((cardA, cardB) => {
//     if (cardA.value < cardB.value) {
//       return -1;
//     }
//     if (cardB.value < cardA.value) {
//       return 1;
//     }
//     return 0;
//   });
//   if (cards[0].desc !== 'A') {
//     console.log('card not ace');
//     return cards.reduce((acc, card, i) => (cards[i + 1] ? card.value === cards[i + 1].value - 1 && card.suit === cards[i + 1].suit && acc : acc), true);
//   } else {
//     console.log('card be ace');    
//     withAceAtValueOne = cards.reduce((acc, card, i) => (cards[i + 1] ? card.value === cards[i + 1].value - 1 && card.suit === cards[i + 1].suit && acc : acc), true);
//     console.log('withAtValueOne was set to', withAceAtValueOne);
//     console.log('works up to this point');
//     if (withAceAtValueOne === true) {
//       console.log('breaks here for noooooooo reason');
//       console.log('evaluating to true');
//       return true;
//     } else {
//       console.log('breaks here for noooooooo reason');
//       console.log('card before value switch', cards[0]);
//       cards[0] = {suit: cards[0].suit, value: 14, name: 'A'};
//       cards[0].value = 14;
//       console.log('card after value switch', cards[0]);
//       cards.sort((cardA, cardB) => {
//       if (cardA.value < cardB.value) {
//         return -1;
//       }
//       if (cardB.value < cardA.value) {
//         return 1;
//       }
//       return 0;
//       });
//       return cards.reduce((acc, card, i) => (cards[i + 1] ? card.value === cards[i + 1].value - 1 && card.suit === cards[i + 1].suit && acc : acc), true);
//     }
//   }
// };

// const isHandWinning = (hand) => {
//   console.log(hand);
//   for (let i = 0; i < hand.length; i++) {
//     for (let j = i + 1; j < hand.length; j++) {
//       for (let k = j + 1; k < hand.length; k++) {
//         for (let l = k + 1; l < hand.length; l++) {
//           if (areCardsSameValue(hand[i], hand[j], hand[k], hand[l]) || areCardsRun(hand[i], hand[j], hand[k], hand[l])) {
//             let otherCards = hand.filter((card) => {
//               return card !== hand[i] && card !== hand[j] && card !== hand[k] && card !== hand[l];
//             });
//             if (areCardsSameValue(...otherCards) || areCardsRun(...otherCards)) {
//               return true;
//             }
//           }
//         }
//       }
//     }
//   }
//   return false;
// };

router.route('/:gameId/:playerId/:cardId')
  .get((req, res) => {
    const getGame = new Promise((resolve, reject) => {
      findGame(req.params.gameId, resolve);
    });
    getGame
    .then(game => {
      if (!game) { throw err; }
      let card, hand, playerName;
      for (let i = 0; i < game.owners.length; i++) {
        if (game.owners[i]._id.toString() === req.params.playerId) {
          if (game.owners[i].cards.length === 7) {
            res.status(403).send('You have already discarded this turn');
          }
          for (let j = 0; j < game.owners[i].cards.length; j++) {
            if (game.owners[i].cards[j]._id.toString() === req.params.cardId) {
              card = game.owners[i].cards.splice(j, 1)[0];
              if (isHandWinning(game.owners[i].cards)) {
                console.log('game over!');
                game.complete = true;
                game.winner = game.owners[i].name;
                console.log(game);
                updateGame(req.params.gameId, game, res);
                return;
              }
              console.log('hand did not win');
            }
          }
        }
      }

      for (let i = game.owners.length - 1; i > 0; i--) {
        if (game.owners[i].name === 'Discard') {
          game.owners[i].cards.push(card);
          break;
        }
      }
      updateGame(req.params.gameId, game, res);
      return;
    })
    .catch(err => (`Error moving card: ${err}`));
  });

module.exports = router;
