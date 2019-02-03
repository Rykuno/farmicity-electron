import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from '../components/Login';
import Games from '../components/Games';
import withAuth from '../HOC/RequireAuth';
import Settings from '../components/Settings';
import Mods from '../components/Mods';

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/" component={withAuth(Games)} />
      <Route exact path="/settings" component={withAuth(Settings)} />
      <Route exact path="/mods" component={withAuth(Mods)} />
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
