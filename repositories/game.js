const { Op } = require('sequelize');
const db = require('../models');

module.exports = {
  findAllGamesByPlatformAndLikeName: async (platform, name) =>
    db.Game.findAll({
      where: {
        ...(platform !== '' ? { platform } : {}),
        name: { [Op.substring]: name },
      },
      order: [['createdAt', 'DESC']],
    }),

  findAllGames: async () => db.Game.findAll({ order: [['createdAt', 'DESC']] }),
};
