import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import ErrorCom from "./Components/ErrorCom";
import Boost from "./pages/Boost";
import Wallet from "./pages/Wallet";
import TasksList from "./pages/Tasks";
import ReferralRewards from "./pages/Rewards";
import Dashboard from "./pages/Dashboard";
import NotAdmin236 from "./pages/NotAdmin236";
import Settings from "./pages/Settings";
import EditTasks from "./pages/EditTasks";
import ExtrenalTasks from "./pages/ExtrenalTasks";
import Search from "./pages/Search";
import Statistics from "./pages/Statistics";
import { AuthContextProvider } from "./context/AuthContext";
import GoldHunters from "./pages/GoldHunters";
import Roulette from "./pages/Roulette";
import Mine from "./pages/Mine";
import Qualify from "./pages/Qualify";
import History from "./pages/History";
import AdminYoutube from "./pages/AdminYoutube";
import AirdropWallets from "./pages/AirdropWallets";
import DailyCheckIn from "./pages/Checkin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorCom />,
    children:[
      {
        path:"/",
        element: <GoldHunters />,
      },
      {
        path:"/roulette",
        element: <Roulette />,
      },
      {
        path:"/mine",
        element: <Mine />,
      },
      {
        path:"/checkin",
        element: <DailyCheckIn />,
      },
      {
        path:"/qualify",
        element: <Qualify />,
      },
      {
        path:"/history",
        element: <History />,
      },
      {
        path:"/tasks",
        element: <TasksList />,
      },
      {
        path:"/boost",
        element: <Boost />,
      },
      {
        path:"/wallet",
        element: <Wallet />,
      },
      {
        path:"/rewards",
        element: <ReferralRewards />,
      },
      {
        path:"/dashboardadmin36024x",
        element: <NotAdmin236 />,
      },
    ]

  },
  {
    path: "/dashboardAdx",
    element: <Dashboard />,
    errorElement: <ErrorCom />,
    children:[
      {
        path:"/dashboardAdx/settings",
        element: <Settings />,
      },
      {
        path:"/dashboardAdx/managetasks",
        element: <EditTasks />,
      },
      {
        path:"/dashboardAdx/externaltasks",
        element: <ExtrenalTasks />,
      },
      {
        path:"/dashboardAdx/youtube",
        element: <AdminYoutube />,
      },
      {
        path:"/dashboardAdx/wallets",
        element: <AirdropWallets />,
      },
      {
        path:"/dashboardAdx/search",
        element: <Search />,
      },
      {
        path:"/dashboardAdx/stats",
        element: <Statistics />,
      },

    ]
  }
]);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  </AuthContextProvider>
);
