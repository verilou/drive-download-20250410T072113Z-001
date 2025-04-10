const {
  findAllGamesByPlatformAndLikeName,
  findAllGames,
} = require('../repositories/game');

module.exports = {
  searchGames: async (platform, name) => {
    const games = await findAllGamesByPlatformAndLikeName(platform, name);
    if (games.length === 0) {
      const allGames = await findAllGames();
      return allGames;
    }
    return games;
  },
};
