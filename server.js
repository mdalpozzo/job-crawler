const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const port = process.env.PORT || 8000;

// MiddleWare
app.use(cors());

app.use('/', express.static(path.join(__dirname, './client/public')));

// any requests that don't have a matching end point
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build/index.html'), err => {
//     if (err) {
//       res.status(500).send(err);
//     }
//   });
// });

app.get('/url', (req, res) => {
  const url = req.query.url;

  axios
    .get(url)
    .then(response => {
      const $ = cheerio.load(response.data);
      const jobs = [];

      // extract to separate functions/routes for each website pattern
      //for now...
      if (url.includes('www.indeed.com')) {
        $('.jobsearch-SerpJobCard').each((i, el) => {
          let jobItem = {
            jobTitle: $(el)
              .find('.jobtitle')
              .text(),
            url: `https://www.indeed.com${$(el)
              .find('.turnstileLink')
              .attr('href')}`,
            company: $(el)
              .find('.company')
              .text(),
            location: $(el)
              .find('.location')
              .text(),
            summary: $(el)
              .find('.summary')
              .text(),
            date: $(el)
              .find('.date')
              .text(),
          };

          jobs.push(jobItem);
        });
      }
      res.send(jobs);
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(port, () => console.log(`Server doin it's thing on port ${port}...`));
