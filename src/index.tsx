import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/store';
import { MuiThemeProvider } from '@material-ui/core';
import { lightTheme } from './components/theme/theme';
import { MultiwalletProvider } from './contexts';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MultiwalletProvider>
    <Provider store={store}>
      <MuiThemeProvider theme={lightTheme}>
      <App/>
      </MuiThemeProvider>
    </Provider>
    </MultiwalletProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
