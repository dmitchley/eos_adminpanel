/*eslint-disable*/
import React, { useEffect } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";
import RTLNavbarLinks from "components/Navbars/RTLNavbarLinks.js";
import Button from "components/CustomButtons/Button.js";
import Notifications from "@material-ui/icons/Notifications";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { setNotiCountListener, setNotiCountforReqListener } from 'reduxStore/ReduxAction/notificationAction';
import { uniformNotiListener } from 'reduxStore/ReduxAction/uniformRequestAction';
import { reqCatchNotiListener } from 'reduxStore/ReduxAction/requestCatchupAction';
import { myFirebase, db } from 'services/firebase';

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";

const useStyles = makeStyles(styles);

let uniformSub = null;
let reqCatchSub = null;

function Sidebar(props) {
  const { uniformNotiCount, reqCatchNotiCount } = props;
  const classes = useStyles();
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }

  useEffect(() => {
    uniformCountListener();
    reqCatchCountListener();
    return () => {
      uniformSub();
      reqCatchSub();
      // Anything in here is fired on component unmount.
    }
  }, [])

  const uniformCountListener = async () => {
    return new Promise(async (resolve, reject) => {
      uniformSub = db.collection('uniform_request')
      .where('isNotiRead', '==', false)
        .onSnapshot(querySnapshot => {
          querySnapshot.docChanges().forEach(async change => {
            console.log(change.type)
            if (change.type === 'added') {
              // resolve(1)
              props.uniformNotiListener(1)
              props.setNotiCountListener(1)
            }
            if (change.type === 'modified') {
              if(uniformNotiCount > 0) {
                props.uniformNotiListener(-1)
                props.setNotiCountListener(-1)
              }
             
              // resolve(-1)
            }
          });
        });
    })
  }

  const reqCatchCountListener = async () => {
    return new Promise(async (resolve, reject) => {
      reqCatchSub = db.collection('request_catchup_class')
      .where('isNotiRead', '==', false)
        .onSnapshot(querySnapshot => {
          querySnapshot.docChanges().forEach(async change => {
            console.log(change.type)
            if (change.type === 'added') {
              // resolve(1)
              props.reqCatchNotiListener(1)
              props.setNotiCountforReqListener(1)
            }
            if (change.type === 'modified') {
              // props.reqCatchNotiListener(-1)
              // props.setNotiCountforReqListener(-1)
              // resolve(-1)
            }
          });
        });
    })
  }

  const { color, logo, image, logoText, routes } = props;
  console.log(routes);
  var links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        var activePro = " ";
        var listItemClasses;
        if (prop.path === "/upgrade-to-pro") {
          activePro = classes.activePro + " ";
          listItemClasses = classNames({
            [" " + classes[color]]: true
          });
        } else {
          listItemClasses = classNames({
            [" " + classes[color]]: activeRoute(prop.layout + prop.path)
          });
        }
        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path)
        });
        return (
          <NavLink
            to={prop.layout + prop.path}
            className={activePro + classes.item}
            activeClassName="active"
            key={key}
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
              {typeof prop.icon === "string" ? (
                <Icon
                  className={classNames(classes.itemIcon, whiteFontClasses, {
                    [classes.itemIconRTL]: props.rtlActive
                  })}
                >
                  {prop.icon}
                </Icon>
              ) : (
                <>
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive
                    })}
                  />
                  {prop.name === 'Request Catchup'
                    &&
                    <span className={classes.notifications}>{reqCatchNotiCount}</span>
                  }
                  {prop.name === 'Uniform Request'
                    &&
                    <span className={classes.notifications}>{uniformNotiCount}</span>
                  }
                </>

                // <Button
                //   color={window.innerWidth > 959 ? "transparent" : "white"}
                //   justIcon={window.innerWidth > 959}
                //   simple={!(window.innerWidth > 959)}
                //   // aria-owns={openNotification ? "notification-menu-list-grow" : null}
                //   aria-haspopup="true"
                //   // onClick={handleClickNotification}
                //   className={classes.buttonLink}
                // >
                //   <Notifications className={classes.icons} />
                //   <span className={classes.notifications}>{5}</span>
                // </Button>
              )}
              <ListItemText
                primary={props.rtlActive ? prop.rtlName : prop.name}
                className={classNames(classes.itemText, whiteFontClasses, {
                  [classes.itemTextRTL]: props.rtlActive
                })}
                disableTypography={true}
              />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );
  var brand = (
    <div className={classes.logo}>
      <a
        // href="https://www.creative-tim.com?ref=mdr-sidebar"
        className={classNames(classes.logoLink, {
          [classes.logoLinkRTL]: props.rtlActive
        })}
        target="_blank"
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </a>
    </div>
  );
  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            })
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            })
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool
};

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
    reqCatchNotiListener,
    setNotiCountforReqListener
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);