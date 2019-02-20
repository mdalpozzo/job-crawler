import React, { Component } from 'react';
import axios from 'axios';

import TextFieldGroup from './common/TextFieldGroup.jsx';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      html: 'nothing yet',
      jobs: [],
    };
  }

  getPage = url => {
    axios
      .get(`/url`, {
        params: {
          url,
        },
      })
      .then(res => {
        this.setState({
          jobs: res.data,
          html: res.data,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  indeedJobs = () => {
    this.getPage(
      'https://www.indeed.com/jobs?q=software+engineer+javascript&l=San+Francisco,+CA&explvl=entry_level'
    );
  };

  linkedinJobs = () => {
    this.getPage('https://www.linkedin.com/jobs/search?keywords=javascript');
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    let url = this.state.url;
    const prefix = url.slice(0, 4);
    if (prefix !== 'http') {
      url = `https://${url}`;
    }
    this.getPage(url);
  };

  componentDidMount() {
    // this.getPage();
  }

  render() {
    let jobList = [];
    if (this.state.jobs.length > 0) {
      for (let i = 0; i < this.state.jobs.length; i++) {
        jobList.push(
          <div key={i} className="jobcard">
            <h4>{this.state.jobs[i].jobTitle}</h4>
            <h5>{this.state.jobs[i].company}</h5>
            <p>{this.state.jobs[i].location}</p>
            <p>{this.state.jobs[i].summary}</p>
            <p>{this.state.jobs[i].date}</p>
            <a href={this.state.jobs[i].url} target="_blank">
              Job Post
            </a>
          </div>
        );
      }
    }

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <TextFieldGroup
            placeholder="Enter a URL to start scraping..."
            name="url"
            value={this.state.url}
            onChange={this.onChange}
            // error={errors.url}
            info="The URL that you would like to search."
          />
          <input type="submit" value="Scrape" />
        </form>
        <button onClick={this.indeedJobs}>Indeed</button>
        <button onClick={this.linkedinJobs}>LinkedIn</button>
        <div
          style={{
            border: '1px solid black',
            minHeight: '50rem',
            textAlign: 'center',
            backgroundColor: '#eee',
          }}
        >
          {/* {jobList} */}
          <div dangerouslySetInnerHTML={{ __html: this.state.html }} />
        </div>
      </div>
    );
  }
}

export default MainPage;
