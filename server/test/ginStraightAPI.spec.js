'use strict';
const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
// const app = require('../app.js');
const server = require('../index.js').server;
const dbUtils = require('../../db/lib/utils.js');
const { card: Card, owner: Owner, game: Game } = require('../../db/index');

describe('Gin Straight API', () => {

  after(() => {
    Game.remove({}, function (err) {
      if (err) { 
        console.error(err);
      }
    });
    Owner.remove({}, function (err) {
      if (err) { 
        console.error(err);
      }
    });
    Card.remove({}, function (err) {
      if (err) { 
        console.error(err);
      }
    });
  });

  it('accepts POST request to /createGame and returns game info', (done) => {
    let newGameDataObj = {
      type: 'Gin Straight',
      name: "Jake's Game",
      public: true,
      open: true,
      complete: false,
      winner: null,
      owners: [{
        name: 'Jake',
        username: 'jakeCode',
        turn: 0
      }]
    };

    request(server)
      .post('/api/createGame')
      .send(newGameDataObj)
      .expect((res) => {
        res.body.gameId = typeof res.body.gameId === 'string' && res.body.gameId.length === 24;
        res.body.player._id = typeof res.body.player._id === 'string' && res.body.player._id.length === 24;
      })
      .expect(201, {
        gameId: true,
        player: 
          { name: 'Jake',
           username: 'jakeCode',
           turn: 0,
           _id: true,
           cards: [] 
          }
      })
      .end(done);
  });

  let gameId;

  it('accepts GET requests to /games and returns a previously posted game', (done) => {
    request(server)
      .get('/api/games')
      .expect((res) => {
        gameId = res.body[0]._id;
        res.body[0]._id = typeof res.body[0]._id === 'string' && res.body[0]._id.length === 24;
        res.body[0].key = typeof res.body[0].key === 'string' && res.body[0].key.length === 24;
        res.body[0].owners[0]._id = typeof res.body[0].owners[0]._id === 'string' && res.body[0].owners[0]._id.length === 24;
      })
      .expect(200, [
        { 
          _id: true,
          type: 'Gin Straight',
          name: 'Jake\'s Game',
          public: true,
          open: true,
          complete: false,
          winner: null,
          __v: 0,
          key: true,
          owners: 
            [ {
                name: 'Jake',
                username: 'jakeCode',
                turn: 0,
                _id: true,
                cards: []
              } 
            ]
        }
      ])
      .end(done);
  });

  it('accepts POST request /addPlayer and returns ', (done) => {
    let addPlayerDataObj = {
      gameId: gameId,
      player: {
        name: 'Henri',
        username: 'chickenTrain'
      }
    };

    request(server)
      .post('/api/addPlayer')
      .send(addPlayerDataObj)
      .expect(200)
      .end(done);
  }); 

  // it('accepts GET requests to /api/profiles/:id', function (done) {
  //   request(app)
  //     .get('/api/profiles/1')
  //     .expect(res => {
  //       res.body = {
  //         id: res.body.id,
  //         created_at: !!Date.parse(res.body.created_at)
  //       };
  //     })
  //     .expect(200, {
  //       id: 1,
  //       created_at: true
  //     })
  //     .end(done);
  // });

  // it('sends 404 if id on GET requests to /api/profiles/:id does not exist', function (done) {
  //   request(app)
  //     .get('/api/profiles/123')
  //     .expect(404)
  //     .end(done);
  // });

  // it('accepts POST requests to /api/profiles', function (done) {
  //   request(app)
  //     .post('/api/profiles')
  //     .send({
  //       username: 'TestUser4',
  //       password: 'happy'
  //     })
  //     .expect(res => {
  //       res.body = {
  //         username: res.body.username,
  //         password: res.body.password
  //       };
  //     })
  //     .expect(201, {
  //       username: 'TestUser4',
  //       password: undefined
  //     })
  //     .end(done);
  // });

  // it('accepts PUT requests to /api/profiles/:id', function () {
  //   let profile = {
  //     first: 'James',
  //     last: 'Davenport',
  //     display: 'James Davenport',
  //     email: 'example@email.com',
  //     phone: '415-555-1234'
  //   };

  //   return request(app)
  //     .put('/api/profiles/1')
  //     .send(profile)
  //     .expect(201)
  //     .then(() => {
  //       return request(app)
  //         .get('/api/profiles/1')
  //         .expect(res => {
  //           res.body = {
  //             first: res.body.first,
  //             last: res.body.last,
  //             display: res.body.display,
  //             email: res.body.email,
  //             phone: res.body.phone
  //           };
  //         })
  //         .expect(200, profile);
  //     });
  // });

  // it('sends 404 if id on PUT requests to /api/profiles/:id does not exist', function (done) {
  //   request(app)
  //     .put('/api/profiles/123')
  //     .expect(404)
  //     .end(done);
  // });

  // it('accepts DELETE requests to /api/profiles/:id', function (done) {
  //   request(app)
  //     .delete('/api/profiles/1')
  //     .expect(200)
  //     .end(done);
  // });

  // it('sends 404 if id on DELETE requests to /api/profiles/:id does not exist', function (done) {
  //   request(app)
  //     .delete('/api/profiles/123')
  //     .expect(404)
  //     .end(done);
  // });
});
