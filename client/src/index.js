import React from '../node_modules/react';
import ReactDOM from '../node_modules/react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
