// COMMENT: imports the required modules
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";

// COMMENT: defines the router variable to create a new BrowserRouter
const router = createBrowserRouter([
     {
          path: "/",
          element: <App />,
          errorElement: <h1 className="display-2">Wrong page!</h1>,
          children: [
               {
                    index: true,
                    element: <SearchBooks />,
               },
               {
                    path: "/saved",
                    element: <SavedBooks />,
               },
          ],
     },
]);

// COMMENT: renders the RouterProvider component and passes the router variable as a prop
ReactDOM.createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
