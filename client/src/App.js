import React, { Suspense } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { routes } from './routes';

function App() {
  return (
    <div className="App">
      <Router history={createBrowserHistory()}>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            {
              routes.map(route => {
                return (
                  <Route exact key={route.path} path={route.path} component={route.component} />
                )
              })
            }
            <Redirect from="/" to={routes[0].path} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
