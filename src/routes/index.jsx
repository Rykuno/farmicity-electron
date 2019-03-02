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
      <Route exact path="/" component={Games} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/mods" component={Mods} />
    </Switch>
  </BrowserRouter>
);

export default AppRouter;
