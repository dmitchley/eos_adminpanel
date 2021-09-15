import React, { useState } from "react";
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
import { loginAdmin } from 'reduxStore/ReduxAction/authAction';
import { useHistory, Redirect } from "react-router-dom";
import Grid from '@material-ui/core/Grid'
import avatar from "assets/img/faces/marc.jpg";

const styles = {
  rootContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'absolute',
    left: '0px',
    width: '100%',
    overflow: 'hidden',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#000",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  header: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginForm: {
    justifyContent: 'center',
    minHeight: '90vh'
  },

  root: {
    minWidth: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  card: {
    maxWidth: "100%",
    minHeight: "20vh",
    display: "flex",
    "@media only screen and (max-width: 1366px)": {
      width: '380px'
    }
  },
  loginButton: {
    minWidth: "20vh",
    background: 'linear-gradient(0deg, #fe6c44 15%, #a0452c 90%)',
  }
};

const useStyles = makeStyles(styles);

function Login(props) {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    const { isLoggingIn, loginError } = props;
    const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    if (!isValidEmail) {
      alert('Enter valid email address !!');
      return;
    } else if (password.length < 6) {
      alert('Password length must be atleast 6 character');
      return;
    }
    await props.loginAdmin(email, password);
  }

  return (
    <div>
      {props.isLoggingIn
        ?
        <Redirect to="/admin/dashboard" />
        :
        <div>
          <Grid
            className={classes.root}
            spacing={0}
            alignItems="center"
            justify="center"
          >
            <GridItem xs={12} sm={12} md={8}>
              <Card className={classes.card}>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Login</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} >
                    <CustomInput
                        labelText="Email address"
                        id="email-address"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: (e) => setEmail(e.target.value)
                        }}
                      />
                    </GridItem>
                  </GridContainer>

                  <GridContainer>
                    <GridItem xs={12} >
                    <CustomInput
                        labelText="Password"
                        id="password"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: 'password',
                          onChange: (e) => setPassword(e.target.value)
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
                <CardFooter style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Button color="buttonGradient" className={classes.loginButton} onClick={() => onLogin()} >Login</Button>
                </CardFooter>
              </Card>
            </GridItem>
          </Grid>
        </div>
      }
    </div>
  );
}

const mapStateToProps = state => {
  return {
    isLoggingIn: state.authReducer.isLoggingIn,
    loginError: state.authReducer.loginError
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    loginAdmin
  }, dispatch)

}
export default connect(mapStateToProps, mapDispatchToProps)(Login);