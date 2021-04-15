import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dist/css/mdb.css';
import './index.css';
import LoginPage from './LoginPage';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <LoginPage />,
  document.getElementById('encabezado')
);

registerServiceWorker();
