var express = require('express');
var router = express.Router();

var async = require('async');
var Web3 = require('web3');
var web3complete = require('web3-complete');

router.get('/', function(req, res, next) {
  var config = req.app.get('config');
  var web3 = new Web3();
  web3complete(web3);
  web3.setProvider(config.provider);

  async.waterfall([
    function(callback) {
      web3.eth.getBlock("latest", false, function(err, result) {
        callback(err, result);
      });
    }, function(lastBlock, callback) {
      var blocks = [];

      // checks if number of blocks in chain is less than configured blocks
      var totalBlocks = config.blockCount;
      if (lastBlock.number - config.blockCount < 0) {
        totalBlocks = lastBlock.number + 1;
      }

      async.times(totalBlocks, function(n, next) {
        web3.eth.getBlock(lastBlock.number - n, true, function(err, block) {
          next(err, block);
        });
      }, function(err, blocks) {
        callback(err, blocks);
      });
    }
  ], function(err, blocks) {
    if (err) {
      return next(err);
    }

    var txs = [];
    blocks.forEach(function(block) {
      block.author = block.author || block.miner;

      block.transactions.forEach(function(tx) {
        if (txs.length === 32) {
          return;
        }
        txs.push(tx);
      });
    });
    if (blocks.length > 10) {
      blocks = blocks.slice(0,10);
    }
    res.render('index', { blocks: blocks, txs: txs, blockCount: config.blockCount });
  });

});

module.exports = router;
