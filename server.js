const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

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
  let jobs = [];

  (async () => {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'
      );
      const html = await page.content();
      // ambigous but works for now
      console.log('HTML:', html);

      if (url.includes('www.indeed.com')) {
        const jobList = (await page.$$('.jobsearch-SerpJobCard'))
          ? await page.$$('.jobsearch-SerpJobCard')
          : null;

        for (const listing of jobList) {
          const jobTitle = (await listing.$('.jobtitle'))
            ? await listing.$eval('.jobtitle', jobTitle => jobTitle.innerText)
            : null;
          const company = (await listing.$('.company'))
            ? await listing.$eval('.company', company => company.innerText)
            : null;
          const location = (await listing.$('.location'))
            ? await listing.$eval('.location', location => location.innerText)
            : null;
          const summary = (await listing.$('.summary'))
            ? await listing.$eval('.summary', summary => summary.innerText)
            : null;
          const date = (await listing.$('.date'))
            ? await listing.$eval('.date', date => date.innerText)
            : null;
          let url = (await listing.$('.turnstileLink'))
            ? await listing.$eval('.turnstileLink', a => a.href)
            : null;
          const jobItem = {
            url,
            jobTitle,
            company,
            location,
            summary,
            date,
          };
          jobs.push(jobItem);
        }
      }
      //linked in
      // if (url.includes('www.linkedin.com')) {
      //   let topClass = '';
      //   await page
      //     .waitFor('.job-card-search')
      //     .then(() => {
      //       topClass = '.job-card-search';
      //       console.log('JOBS LOADED SUCCESFULLY');
      //     })
      //     .catch(err => {
      //       topClass = '.jobs-search-result-item';
      //       console.log('JOBS NOT LOADED SUCCESFULLY', err);
      //     });
      //   const jobList = (await page.$$(topClass)) ? await page.$$(topClass) : null;

      //   console.log('JOBLIST IS:', jobList === true);

      //   for (const listing of jobList) {
      //     const jobTitle = (await listing.$('.listed-job-posting__title'))
      //       ? await listing.$eval('.listed-job-posting__title', jobTitle => jobTitle.innerText)
      //       : null;
      //     const company = (await listing.$('.listed-job-posting__company'))
      //       ? await listing.$eval('.listed-job-posting__company', company => company.innerText)
      //       : null;
      //     const location = (await listing.$('.listed-job-posting__location'))
      //       ? await listing.$eval('.listed-job-posting__location', location => location.innerText)
      //       : null;
      //     const summary = (await listing.$('.listed-job-posting__description'))
      //       ? await listing.$eval('.listed-job-posting__description', summary => summary.innerText)
      //       : null;
      //     const date = (await listing.$('.posted-time-ago__text'))
      //       ? await listing.$eval('.posted-time-ago__text', date => date.innerText)
      //       : null;
      //     let url = (await listing.$('a')) ? await listing.$eval('a', a => a.href) : null;
      //     const jobItem = {
      //       url,
      //       jobTitle,
      //       company,
      //       location,
      //       summary,
      //       date,
      //     };
      //     jobs.push(jobItem);
      //   }
      // }

      // res.send(jobs);
      res.send(html);
      await browser.close();
    } catch (err) {
      console.log('server issue', err);
    }
  })();

  // axios
  //   .get(url)
  //   .then(response => {
  //     const $ = cheerio.load(response.data);
  //     const jobs = [];

  //     // extract to separate functions/routes for each website pattern
  //     // but for now...

  //     //indeed
  //     if (url.includes('www.indeed.com')) {
  //       $('.jobsearch-SerpJobCard').each((i, el) => {
  //         let jobItem = {
  //           jobTitle: $(el)
  //             .find('.jobtitle')
  //             .text(),
  //           url: `https://www.indeed.com${$(el)
  //             .find('.turnstileLink')
  //             .attr('href')}`,
  //           company: $(el)
  //             .find('.company')
  //             .text(),
  //           location: $(el)
  //             .find('.location')
  //             .text(),
  //           summary: $(el)
  //             .find('.summary')
  //             .text(),
  //           date: $(el)
  //             .find('.date')
  //             .text(),
  //         };

  //         jobs.push(jobItem);
  //       });
  //     }
  //     //linked in
  //     if (url.includes('www.linkedin.com')) {
  //       console.log($('.jobs-search-result').html());
  //       $('.jobs-search-result')
  //         .find('li')
  //         .each((i, el) => {
  //           console.log(
  //             'hello',
  //             $(el)
  //               .find('.job-card-search__link-wrapper')
  //               .text()
  //           );
  //           let jobItem = {
  //             jobTitle: $(el)
  //               .find('.job-card-search__link-wrapper')
  //               .text(),
  //             url: `https://www.linkedin.com${$(el)
  //               .find('a.job-card-search')
  //               .attr('href')}`,
  //             company: $(el)
  //               .find('.job-card-search__company-name-link')
  //               .text(),
  //             location: $(el)
  //               .find('.job-card-search__location artdeco-entity-lockup__caption')
  //               .text(),
  //             summary: $(el)
  //               .find('.job-card-search__description-snippet')
  //               .text(),
  //             date: $(el)
  //               .find('.job-card-search__time-badge')
  //               .text(),
  //           };

  //           jobs.push(jobItem);
  //         });
  //     }
  //     res.send(jobs);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
});

app.listen(port, () => console.log(`Server doin it's thing on port ${port}...`));
