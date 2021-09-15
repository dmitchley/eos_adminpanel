import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addNotificationRequest } from 'reduxStore/ReduxAction/notificationAction';

import avatar from "assets/img/faces/marc.jpg";

const styles = {
  cardCategoryWhite: {
    color: "rgba(0,0,0,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#000",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "400",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  themeButton: {
    minWidth: "20vh",
    background: 'linear-gradient(0deg, #fe6c44 15%, #a0452c 90%)',
  },
};

const useStyles = makeStyles(styles);

function AddNotification(props) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');

  const onSendNotification = async () => {
    const data = {
      noti_title: notificationTitle,
      noti_body: notificationBody,
      created_at: Math.floor(Date.now() / 1000),
      read_by: []
    }

    if (notificationTitle != '' && notificationBody != '') {
      await props.addNotificationRequest(data);
      history.goBack();
    } else {
      alert('All fields are required')
    }

  }

  return (
    <div>
      <GridContainer justify="center" container>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Send Notification</h4>
              <p className={classes.cardCategoryWhite}>Send Notification to everyone</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Title"
                    id="notification-title"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: notificationTitle,
                      onChange: (e) => setNotificationTitle(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Description"
                    id="notification-body"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 8,
                      value: notificationBody,
                      onChange: (e) => setNotificationBody(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

            </CardBody>
            <CardFooter style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Button className={classes.themeButton} color="buttonGradient" onClick={() => onSendNotification()}>Submit</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    notificationsData: state.notificationReducer
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addNotificationRequest
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddNotification);