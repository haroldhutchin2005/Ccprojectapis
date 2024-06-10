const express = require('express');
const axios = require('axios');
const { SoundCloud } = require('scdl-core');

const router = express.Router();

router.get('/soundcloud', async (req, res) => {
  try {
    const search = req.query.search;
    const axiosResponse = await axios.get(`https://cprojectapisjonellv2.adaptable.app/api/sc?query=${search}`);
    const firstUrl = axiosResponse.data[0].url;

    const permalink = firstUrl;
    const streamOptions = {
      highWaterMark: 1 << 25
    };

    await SoundCloud.connect();
    const stream = await SoundCloud.download(permalink, streamOptions);

    res.setHeader('Content-Type', 'audio/mpeg');
    stream.pipe(res);

    setTimeout(() => {
      stream.destroy();
    }, 5 * 60 * 1000);
  } catch (error) {
    console.error('Error downloading the audio:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
