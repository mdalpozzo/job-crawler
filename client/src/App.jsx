import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Search from './components/Search.jsx';
import MainPage from './components/MainPage.jsx';
// import MainPage from './components/MainPage.jsx';

class App extends Component {
  render() {
    return <MainPage />;
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById('app'));
