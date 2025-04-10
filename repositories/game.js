const { Op } = require('sequelize');
const db = require('../models');

module.exports = {
  findAllGamesByPlatformAndLikeName: (platform, name) =>
    db.Game.findAll({
      where: {
        ...(platform !== '' ? { platform } : {}),
        name: { [Op.substring]: name },
      },
      order: [['createdAt', 'DESC']],
    }),

  findAllGames: () => db.Game.findAll({ order: [['createdAt', 'DESC']] }),

  bulkCreateGames: (games) =>
    db.Game.bulkCreate(games, {
      ignoreDuplicates: true,
    }),

  findGameByStoreId: (storeIds) =>
    db.Game.findAll({ where: { storeId: { [Op.in]: storeIds } } }),
};
