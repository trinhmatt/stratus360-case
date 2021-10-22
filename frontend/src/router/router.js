import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from '../components/Home';

const AppRouter = () => (
    <Router>
        <Switch>
            <Route path="/" exact>
                <Home />
            </Route>

            <Route path="/:comicNumber">
                <Home />
            </Route>
        </Switch>
    </Router>
)

export default AppRouter;