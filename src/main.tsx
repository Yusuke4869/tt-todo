import { createRoot } from "react-dom/client";

import App from "./app";
import "~/styles/index.scss";

createRoot(document.getElementById("root")!).render(<App />);
