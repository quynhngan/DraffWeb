import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import ImageDetailPage from './pages/ImageDetailPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import Dashboard from './components/Dashboard';
import * as serviceWorker from './serviceWorker';
import { Router, Route } from 'react-router-dom';
import history from './components/history';
import './index.css';
import UserContext from './components/UserContext';

ReactDOM.render(
  <UserContext>
    <Router history={history}>
      <div>
        <Route exact={true} path="/" component={Dashboard} />
        <Route path="/images/:id" component={ImageDetailPage} />
        <Route exact={true} path="/projects" component={ProjectListPage} />
        <Route path="/projects/:id" component={ProjectDetailPage} />
      </div>
    </Router>
  </UserContext>,
  document.getElementById('root')
);

serviceWorker.unregister();
