import { createBrowserHistory } from 'history';
import React, { Suspense } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { routes } from './routes';
import client from './socket';
import { getValueFromStorage } from './Utils/Utils';

function ProtectedRoutes({ component: Component, ...props }) {
  return (
    <Route {...props} render={() => {
      let meetingId;
      const meeting = getValueFromStorage('meeting');
      if (meeting) {
        ({ id: meetingId } = meeting);
      }
      return (!client.socket || !client.socketId) ?
        <Redirect to={`/join${meetingId ? `?meetingId=${meetingId}` : ''}`} /> :
        <Component {...props} />
    }} />
  )
}

function App() {
  return (
    <div className="App">
      <Router history={createBrowserHistory()}>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            {
              routes.map(route => {
                if (route.protected) {
                  return (
                    <ProtectedRoutes
                      exact
                      key={route.path}
                      path={route.path}
                      component={route.component}
                    />
                  );
                } else {
                  return (
                    <Route exact key={route.path} path={route.path} component={route.component} />
                  );
                }
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
