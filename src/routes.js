/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import SupervisorAccount from "@material-ui/icons/SupervisorAccount";
import ChildCare from "@material-ui/icons/ChildCare";
import { FaChild } from 'react-icons/fa'
import School from "@material-ui/icons/School";
import InsertInvitation from "@material-ui/icons/InsertInvitation";
import Receipt from "@material-ui/icons/Receipt";
import PresentToAll from "@material-ui/icons/PresentToAll";
import Class from "@material-ui/icons/Class";
import GroupWork from "@material-ui/icons/GroupWork";
import IndeterminateCheckBox from "@material-ui/icons/IndeterminateCheckBox";
import Notifications from "@material-ui/icons/Notifications";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
//import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Parents from "views/Parents/Parents.js";
import Children from "views/Children/Children.js";
import TimeSlot from "views/TimeSlot/TimeSlot.js";
import Appointment from "views/Appointment/Appointment.js";
import NotificationList from "views/NotificationList/NotificationList.js";
import ClassList from "views/ClassList/ClassList.js";
import StaffList from "views/StaffList/StaffList.js";
import DueInvoice from "views/DueInvoice/DueInvoice.js";
import RequestCatchup from "views/RequestCatchup/RequestCatchup.js";
import Uniformrequest from "views/Uniformrequest/Uniformrequest.js";
import Login from "views/Login/Login.js";
import Add from 'views/Add/add';

const dashboardRoutes = [
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   icon: Dashboard,
  //   component: DashboardPage,
  //   layout: "/admin",
  // },
  {
    path: "/parents",
    name: "Parents",
    icon: SupervisorAccount,
    component: Parents,
    layout: "/admin",
  },
  {
    path: "/children",
    name: "Children",
    icon: ChildCare,
    component: Children,
    layout: "/admin",
  },
  {
    path: "/requestCatchup",
    name: "Request Catchup",
    icon: PresentToAll,
    component: RequestCatchup,
    layout: "/admin",
  },
  {
    path: "/appointment",
    name: "Appointment",
    icon: Receipt,
    component: Appointment,
    layout: "/admin",
  },
  // {
  //   path: "/classes",
  //   name: "Class List",
  //   icon: Class,
  //   component: ClassList,
  //   layout: "/admin",
  // },
  {
    path: "/timeSlot",
    name: "Class List",
    icon: InsertInvitation,
    component: TimeSlot,
    layout: "/admin",
  },
  {
    path: "/StaffList",
    name: "Staff List",
    icon: GroupWork,
    component: StaffList,
    layout: "/admin",
  },
  {
    path: "/dueInvoice",
    name: "Due Invoice",
    icon: IndeterminateCheckBox,
    component: DueInvoice,
    layout: "/admin",
  },
  {
    path: "/notificationList",
    name: "Notification List",
    icon: Notifications,
    component: NotificationList,
    layout: "/admin",
  },
  {
    path: "/Uniformrequest",
    name: "Uniform Request",
    icon: School,
    component: Uniformrequest,
    layout: "/admin",
  },
];

export default dashboardRoutes;
