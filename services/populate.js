const androidGamesS3Path =
  'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json';
const iosGamesS3Path =
  'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json';

module.exports = {
  populateGames: async () => {
    const androidGames = await fetch(androidGamesS3Path);
    const iosGames = await fetch(iosGamesS3Path);
    const androidGamesData = await androidGames.json();
    const iosGamesData = await iosGames.json();
    return { androidGames: androidGamesData, iosGames: iosGamesData };
  },
};
