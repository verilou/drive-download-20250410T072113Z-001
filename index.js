const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const { searchGames } = require('./services/search');
const { searchGameValidator } = require('./validator/searchGameValidator');
const { populateGames } = require('./services/populate');

const PORT = process.env.NODE_ENV === 'test' ? 3001 : 3000;

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/static`));

app.get('/api/games', (req, res) =>
  db.Game.findAll()
    .then((games) => res.send(games))
    .catch((err) => {
      console.log('There was an error querying games', JSON.stringify(err));
      return res.send(err);
    }),
);

app.post('/api/games', (req, res) => {
  const {
    publisherId,
    name,
    platform,
    storeId,
    bundleId,
    appVersion,
    isPublished,
  } = req.body;
  return db.Game.create({
    publisherId,
    name,
    platform,
    storeId,
    bundleId,
    appVersion,
    isPublished,
  })
    .then((game) => res.send(game))
    .catch((err) => {
      console.log('***There was an error creating a game', JSON.stringify(err));
      return res.status(400).send(err);
    });
});

app.delete('/api/games/:id', (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  return db.Game.findByPk(id)
    .then((game) => game.destroy({ force: true }))
    .then(() => res.send({ id }))
    .catch((err) => {
      console.log('***Error deleting game', JSON.stringify(err));
      res.status(400).send(err);
    });
});

app.put('/api/games/:id', (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  return db.Game.findByPk(id).then((game) => {
    const {
      publisherId,
      name,
      platform,
      storeId,
      bundleId,
      appVersion,
      isPublished,
    } = req.body;
    return game
      .update({
        publisherId,
        name,
        platform,
        storeId,
        bundleId,
        appVersion,
        isPublished,
      })
      .then(() => res.send(game))
      .catch((err) => {
        console.log('***Error updating game', JSON.stringify(err));
        res.status(400).send(err);
      });
  });
});

app.post('/api/games/search', async (req, res) => {
  const { name, platform } = req.body;

  const { success, error } = searchGameValidator.safeParse({ name, platform });
  if (!success) {
    return res.status(400).send({ error: error.errors });
  }

  try {
    const response = await searchGames(platform, name);
    res.send(response);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/api/games/populate', async (req, res) => {
  await populateGames();
  res.send({ success: true });
});

app.listen(PORT, () => {
  console.log('Server is up on port 3000');
});

module.exports = app;
