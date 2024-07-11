import { StrictMode } from "react";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";

import { Router } from "./router";
import { store } from "./stores/store";
import "~/styles/app.scss";

import type { FC } from "react";

const App: FC = () => (
  <StrictMode>
    <Provider store={store}>
      <CookiesProvider>
        <Router />
      </CookiesProvider>
    </Provider>
  </StrictMode>
);

export default App;
