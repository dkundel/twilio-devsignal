import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './pages/Home';
import RequestHelp from './pages/RequestHelp';
import Session from './pages/Session';

class App extends Component {
  render() {
    return (
      <Router>
        <div role="main">
          <Route exact path="/" component={Home} />
          <Route path="/request" component={RequestHelp} />
          <Route path="/session/:id" component={Session} />
        </div>
      </Router>
    );
  }
}

export default App;
