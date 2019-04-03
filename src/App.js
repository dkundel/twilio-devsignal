import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';

const Container = styled.div`
  max-width: 800px;
  width: 100%;
  flex: 1;
  padding: 10px 20px;
`;

class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <Router>
          <Container>
            <Route exact path="/" component={Home} />
            {/* <Route path="/request" component={RequestHelp} />
            <Route path="/session/:id" component={Session} /> */}
          </Container>
        </Router>
        <Footer />
      </Fragment>
    );
  }
}

export default App;
