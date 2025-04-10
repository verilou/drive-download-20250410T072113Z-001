const fs = require('fs');
const https = require('https');

const StreamArray = require('stream-json/streamers/StreamArray');
const { bulkCreateGames } = require('../repositories/game');
const db = require('../models');

const androidGamesS3Path =
  'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json';
const iosGamesS3Path =
  'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json';

module.exports = {
  populateGames: async () => {
    try {
      await Promise.all([
        getStreamAndPopulate(androidGamesS3Path, 'android'),
        getStreamAndPopulate(iosGamesS3Path, 'ios'),
      ]);
    } catch (error) {
      console.error('Error populating games', error);
      return false;
    }
    return true;
  },
};

const getStreamAndPopulate = async (path, platform) => {
  https.get(path, async (res) => {
    res.pipe(StreamArray.withParser()).on('data', async (data) => {
      const games = data.value.map((game) => {
        console.log('***Game', game);
        return {
          publisherId: game.publisher_id,
          name: game.name,
          platform,
          storeId: game.appId,
          bundleId: game.bundle_id,
          appVersion: game.version,
          isPublished: new Date(game.release_date) <= new Date(),
        };
      });
      await bulkCreateGames(games);
    });
  });
};
