/*!

=========================================================
* Now UI Dashboard React - v1.4.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Products from "views/Products";
import Branch from "./views/Branch";
import Stock from "./views/Stock";
import StockRequest from "./views/StockRequest";
import MakeStockRequest from "./views/MakeStockRequest";
import React from "react";
import {USER_ROLES as roles} from "./variables/constants";
import StockRequestIncoming from "./views/StockRequestIncoming";
import OrderResult from "./views/OrderResult";
import SalesAgent from "./views/SalesAgent";
import TotalSales from "./views/TotalSales";
import OrderResultAdmin from "./views/OrderResultAdmin";
import Customer from "./views/Customer";

const dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "design_app",
    component: Dashboard,
    layout: "/admin",
    roles: [roles.HEAD_OFFICE_ADMIN, roles.BRANCH_ADMIN, roles.SUPPLIER]
  },
  {
    path: "/stock-request",
    name: "Stock Request",
    icon: "shopping_delivery-fast",
    component: StockRequest,
    layout: "/admin",
    roles: [roles.BRANCH_ADMIN]
  },
  {
    path: "/stock-request-incoming",
    name: "Requested Stocks",
    icon: "shopping_cart-simple",
    component: StockRequestIncoming,
    layout: "/admin",
    roles: [roles.SUPPLIER]
  },
  {
    path: "/stock",
    name: "Current Stock",
    icon: "business_bank",
    component: Stock,
    layout: "/admin",
    roles: [roles.HEAD_OFFICE_ADMIN, roles.BRANCH_ADMIN]
  },
  {
    path: "/branch",
    name: "Branch List",
    icon: "business_bank",
    component: Branch,
    layout: "/admin",
    roles: [roles.HEAD_OFFICE_ADMIN]
  },
  {
    path: "/products",
    name: "Products List",
    icon: "shopping_box",
    component: Products,
    layout: "/admin",
    roles: [roles.HEAD_OFFICE_ADMIN]
  },
  {
    path: "/order_result",
    name: "Order Result",
    icon: "shopping_box",
    component: OrderResult,
    layout: "/admin",
    roles: [roles.BRANCH_ADMIN]
  },
  {
    path: "/order_result_to_admin",
    name: "Order Result for Admin",
    icon: "shopping_box",
    component: OrderResultAdmin,
    layout: "/admin",
    roles: [roles.HEAD_OFFICE_ADMIN]
  },
  {
    path: "/sales_agent_details",
    name: "Sales Agent Details",
    icon: "shopping_box",
    component: SalesAgent,
    layout: "/admin",
    roles: [roles.HEAD_OFFICE_ADMIN]
  },
  {
    path: "/total_sales_by_sales_agents",
    name: "Total Sales by Sales Agents",
    icon: "shopping_box",
    component: TotalSales,
    layout: "/admin",
    roles: [roles.HEAD_OFFICE_ADMIN]
  },
  {
    path: "/customer",
    name: "Customer Details",
    icon: "users_single-02",
    component: Customer,
    layout: "/admin",
    roles: [roles.HEAD_OFFICE_ADMIN, roles.BRANCH_ADMIN]
  },

];

const internalRoutes = [
  {
    path: "/make-stock-request",
    component: MakeStockRequest,
    layout: "/admin",
    roles: [roles.BRANCH_ADMIN]
  },
];

export {dashRoutes, internalRoutes};
