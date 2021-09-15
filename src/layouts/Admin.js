import React from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
// creates a beautiful scrollbar
import Add from '../views/Add/add';
import Login from 'views/Login/Login';
import AddParent from 'views/AddParent/AddParent';
import AddChild from 'views/AddChild/AddChild';
import AddTimeSlot from 'views/AddTimeSlot/AddTimeSlot';
import AddAppointment from 'views/AddAppointment/AddAppointment';
import EditAppointment from 'views/EditAppointment/EditAppointment';
import AddDueinvoice from 'views/AddDueinvoice/AddDueinvoice';
import AddNotification from 'views/AddNotification/AddNotification';
import NotificationReadList from 'views/NotificationReadList/NotificationReadList';
import ViewBooking from 'views/ViewBooking/ViewBooking';
import SetPassword from 'views/SetPassword/SetPassword';
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
//import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
import routes from "routes.js";
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/app_logo.png";
import { connect } from "react-redux";
// import { onMessageListener } from 'services/firebase';
import createBrowserHistory from 'history/createBrowserHistory';
import { messaging } from 'services/firebase';
import { bindActionCreators } from 'redux';
import { setNotiCountListener } from 'reduxStore/ReduxAction/notificationAction';
import { uniformNotiListener } from 'reduxStore/ReduxAction/uniformRequestAction';
import { reqCatchNotiListener } from 'reduxStore/ReduxAction/requestCatchupAction';

// import { askForPermissioToReceiveNotifications } from 'services/firebase';

let ps;

const switchRoutes = (isLogin) => {
  if (isLogin) {
    return (
      <Switch>
        {routes.map((prop, key) => {
          if (prop.layout === "/admin") {
            return (
              <Route
                path={prop.layout + prop.path}
                component={prop.component}
                key={key}
              />
            );
          }
          return null;
        })}
        <Route exact path="/admin/add/">
          <Add />
        </Route>
        <Route exact path="/admin/add/:id">
          <Add />
        </Route>
        <Route exact path="/admin/addParent">
          <AddParent />
        </Route>
        <Route exact path="/admin/addChild">
          <AddChild />
        </Route>
        <Route exact path="/admin/addTimeSlot">
          <AddTimeSlot />
        </Route>
        <Route exact path="/admin/addAppointment">
          <AddAppointment />
        </Route>
        <Route exact path="/admin/addDueinvoice">
          <AddDueinvoice />
        </Route>
        <Route exact path="/admin/sendNotification">
          <AddNotification />
        </Route>
        <Route exact path="/admin/notificationStatus">
          <NotificationReadList />
        </Route>
        <Route exact path="/admin/editAppointment">
          <EditAppointment />
        </Route>
        <Route exact path="/admin/viewBooking">
          <ViewBooking />
        </Route>
        <Route exact path="/admin/setPassword">
          <SetPassword />
        </Route>
        <Redirect from="/admin" to="/admin/parents" />
        {/* <Redirect from="/admin" to="/admin/dashboard" /> */}
      </Switch>
    )
  } else {
    return (
      <Switch>
        <Route path="/login" exact><Login /></Route>
        <Redirect from="/" to="/login" />
      </Switch>
    )
  }

};

const useStyles = makeStyles(styles);

function Admin({ isLoggingIn, loginError, totalNotiCount, uniformNotiCount, reqCatchNotiCount, setNotiCountListener, uniformNotiListener, reqCatchNotiListener, ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  let history = useHistory();
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("blue");
  //const [fixedClasses, setFixedClasses] = React.useState("dropdown show");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isLogin, setIslogin] = React.useState(isLoggingIn);

  // console.clear();
  // console.log('----- totalNotiCount -----');
  // console.log(totalNotiCount)
  // console.log(uniformNotiCount)
  // console.log(reqCatchNotiCount)
  /*const handleImageClick = (image) => {
    setImage(image);
  };
  const handleColorClick = (color) => {
    setColor(color);
  };*/
  /*const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };*/
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  React.useEffect(() => {
    onHandleNotification()
  }, [])

  const onNotification = (notiPayload) => {
    const { type } = notiPayload;
    console.log('---- onNotification -----')
    console.log(notiPayload)
    // if (type === 'Uniform') {
    //   uniformNotiListener(0)
    //   setNotiCountListener(-uniformNotiCount);
    //   // history.push('/admin/Uniformrequest')
    // } else if (type === 'ReqCatch') {
    //   reqCatchNotiListener(0)
    //   setNotiCountListener(-reqCatchNotiCount);
    // }
    // history.push(focusRoute)
  }

  const onHandleNotification = async () => {
    messaging.onMessage((notificationPayload) => {
      try {
        const { data } = notificationPayload;
        const noteTitle = notificationPayload.notification.title;
        const noteOptions = {
          body: notificationPayload.notification.body,
          icon: "typewriter.jpg", //this is my image in my public folder
        };

        // setNotiCountListener(1);
        // // await localStorage.setItem('totalNoti', 'true');
        // if (data.type === 'Uniform') {
        //   uniformNotiListener(1)
        // } else if (data.type === 'ReqCatch') {
        //   reqCatchNotiListener(1)
        // }

        let notification = new Notification(noteTitle, noteOptions);
        notification.onclick = (event) => {
          event.preventDefault();
          onNotification(data);
          notification.close();
        }
      }
      catch (err) {
        console.log('Caught error: ', err);
      }
    })
  }

  React.useEffect(() => {
    const isLogin = localStorage.getItem('isLogin');
    // askForPermissioToReceiveNotifications();
    if (localStorage.getItem('isLogin') !== null) {
      setIslogin(true)
    } else {
      setIslogin(false)
    }
  }, []);
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"Eos- Dance School"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps route we want the map to be on full screen - this is not possible if  content and conatintheer classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes(isLogin)}</div>
          </div>
        ) : (
          <div className={classes.map}>{switchRoutes(isLogin)}</div>
        )}
        {/* {getRoute() ? <Footer /> : null} */}
        {
          // <FixedPlugin
          // handleImageClick={handleImageClick}
          // handleColorClick={handleColorClick}
          // bgColor={colssor}
          // bgImage={image}
          // handleFixedClick={handleFixedClick}
          // fixedClasses={fixedClasses}
          // />

        }
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    isLoggingIn: state.authReducer.isLoggingIn,
    loginError: state.authReducer.loginError,
    totalNotiCount: state.notificationReducer.totalNotificationCount,
    uniformNotiCount: state.uniformReducer.uniformNotiCount,
    reqCatchNotiCount: state.requestCatchupReducer.reqCatchNotiCount,
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setNotiCountListener,
    uniformNotiListener,
    reqCatchNotiListener
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);