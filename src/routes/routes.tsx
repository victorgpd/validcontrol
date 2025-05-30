import { RoutesEnum } from "../enums/routes";
import { RouteObject } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Painel/Dashboard/Dashboard";
import Products from "../pages/Painel/Products/ProductsDashboard/Products";
import ProductManager from "../pages/Painel/Products/ProductManager/ProductManager";
import Validitys from "../pages/Painel/Validitys/ValiditysDashboard/ValiditysDashboard";
import ValidityManager from "../pages/Painel/Validitys/ValidityManager/ValidityManager";
import ImportProduct from "../pages/Painel/Data/ImportProduct/ImportProduct";
import Configuration from "../pages/Painel/Configuration/Configuration";
import CreateStore from "../pages/Painel/CreateStore/CreateStore";
import ExportValiditys from "../pages/Painel/Data/ExportValidity/ExportValidity";
import ExportProduct from "../pages/Painel/Data/ExportProduct/ExportProduct";
import Logs from "../pages/Painel/Logs/Logs";

export const screensRoutes: RouteObject[] = [
  {
    path: RoutesEnum.Home,
    element: <Home />,
    errorElement: <div>404</div>, //<PageNotFound />,
  },
  {
    path: RoutesEnum.Login,
    element: <Login />,
  },
  {
    path: RoutesEnum.Register,
    element: <Register />,
  },
];

export const loggedScreensRoutes: RouteObject[] = [
  {
    path: RoutesEnum.Dashboard,
    element: <Dashboard />,
  },
  {
    path: RoutesEnum.Products,
    element: <Products />,
  },
  {
    path: RoutesEnum.Product_Create,
    element: <ProductManager />,
  },
  {
    path: RoutesEnum.Product_Edit,
    element: <ProductManager />,
  },
  {
    path: RoutesEnum.Validitys,
    element: <Validitys />,
  },
  {
    path: RoutesEnum.Validitys_Create,
    element: <ValidityManager />,
  },
  {
    path: RoutesEnum.Validitys_Edit,
    element: <ValidityManager />,
  },
  {
    path: RoutesEnum.Data_Import,
    element: <ImportProduct />,
  },
  {
    path: RoutesEnum.Data_Export_Validitys,
    element: <ExportValiditys />,
  },
  {
    path: RoutesEnum.Data_Export_Products,
    element: <ExportProduct />,
  },
  {
    path: RoutesEnum.Logs,
    element: <Logs />,
  },
  {
    path: RoutesEnum.Configuration,
    element: <Configuration />,
  },
  {
    path: RoutesEnum.CreateStore,
    element: <CreateStore />,
  },
];
