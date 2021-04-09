import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Class from "./components/Class";
import Login from "./components/Login";

// import ContactUs from "./components/Email";
// import Email from "./components/Email";
// import Email2 from "./components/Email2";
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Router>
            <Switch>
              <Route path="/" exact component={Login} />
              <Route path="/class" component={Class} />
            </Switch>
          </Router>
        </header>
      </div>
    );
  }
}

export default App;
