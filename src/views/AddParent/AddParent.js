import React, { useState, useEffect } from "react";
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
import { addParentRequest, editParentRequest } from 'reduxStore/ReduxAction/parentAction';

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

function AddParent(props) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [isEdit, setIsEdit] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [parentType, setParentType] = useState('');
  const [homePh, setHomePh] = useState('');
  const [workPh, setWorkPh] = useState('');
  const [mobile1, setMobile1] = useState('');
  const [mobile2, setMobile2] = useState('');
  const [faxAddress, setFaxAddress] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [parentState, setParentState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // const [email, setEmail] = useState('jhondoe34@yopmail.com');
  // const [password, setPassword] = useState('123456');
  // const [fname, setFname] = useState('Jhon');
  // const [lname, setLname] = useState('Doe');
  // const [parentType, setParentType] = useState(0);
  // const [homePh, setHomePh] = useState('9876543210');
  // const [workPh, setWorkPh] = useState('9876543210');
  // const [mobile1, setMobile1] = useState('9876543210');
  // const [mobile2, setMobile2] = useState('9876543210');
  // const [faxAddress, setFaxAddress] = useState('123456');
  // const [addressLine1, setAddressLine1] = useState('3437 Coal Street');
  // const [addressLine2, setAddressLine2] = useState('Coal Street');
  // const [city, setCity] = useState('Berlin');
  // const [parentState, setParentState] = useState('Pennsylvania');
  // const [postalCode, setPostalCode] = useState('15530');

  useEffect(() => {
    try {
      const selectedParent = location.state.selectedParent;
      const {
        email,
        password,
        firstName,
        lastName,
        parentType,
        homePhone,
        workPhone,
        primaryMobile,
        secondaryMobile,
        faxAddress,
        addressLine1,
        addressLine2,
        city,
        parentState,
        postalCode
      } = selectedParent;
      if (selectedParent) {
        setIsEdit(true);

        setEmail(email);
        setPassword(password);
        setFname(firstName);
        setLname(lastName);
        setParentType(parentType);
        setHomePh(homePhone);
        setWorkPh(workPhone);
        setMobile1(primaryMobile);
        setMobile2(secondaryMobile);
        setFaxAddress(faxAddress);
        setAddressLine1(addressLine1);
        setAddressLine2(addressLine2);
        setCity(city);
        setParentState(parentState);
        setPostalCode(postalCode);
      }
    } catch (error) {
      return;
    }
  }, [])

  const onAddParent = async () => {
    const data = {
      email: email,
      password: password,
      firstName: fname,
      lastName: lname,
      parentType: parentType,
      homePhone: homePh,
      workPhone: workPh,
      primaryMobile: mobile1,
      secondaryMobile: mobile2,
      faxAddress: faxAddress,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      parentState: parentState,
      postalCode: postalCode
    }

    if (email != '' && password != '' && fname != '' && lname != '' && parentType != '' && homePh != '' && mobile1 != '' && addressLine1 != ''
      && city != '' && parentState != '' && postalCode != '') {
      if (isEdit) {
        const selectedParent = location.state.selectedParent;
        const { parent_id } = selectedParent;
        await props.editParentRequest(parent_id, data);
        history.goBack();
      } else {
        await props.addParentRequest(data);
        history.goBack();
      }
    } else {
      alert('email, password, firstName, lastName, parentType, homePhone, addressLine1, city, state and postalCode should not be empty!!')
    }


  }

  return (
    <div>
      <GridContainer justify="center" container>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Add Parent</h4>
              <p className={classes.cardCategoryWhite}>Add parent profile</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Email address"
                    id="parent-email-address"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: email,
                      onChange: (e) => setEmail(e.target.value)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Password"
                    id="parent-password"
                    inputProps={{
                      type: 'password',
                      value: password,
                      onChange: (e) => setPassword(e.target.value)
                    }}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="First Name"
                    id="parent-first-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: fname,
                      onChange: (e) => setFname(e.target.value)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Last Name"
                    id="parent-last-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: lname,
                      onChange: (e) => setLname(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Parent type"
                    id="parent-type"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: parentType,
                      onChange: (e) => setParentType(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Home phone"
                    id="parent-home-phone"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: homePh,
                      onChange: (e) => setHomePh(e.target.value)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Work phone"
                    id="parent-work-phone"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: workPh,
                      onChange: (e) => setWorkPh(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Primary mobile"
                    id="parent-primary-mobile"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: mobile1,
                      onChange: (e) => setMobile1(e.target.value)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Secondary mobile"
                    id="parent-secondary-mobile"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: mobile2,
                      onChange: (e) => setMobile2(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Customer fax"
                    id="parent-fax-address"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: faxAddress,
                      onChange: (e) => setFaxAddress(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="AddressLine 1"
                    id="parent-address1"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 2,
                      value: addressLine1,
                      onChange: (e) => setAddressLine1(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="AddressLine 2"
                    id="parent-address2"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 2,
                      value: addressLine2,
                      onChange: (e) => setAddressLine2(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="City"
                    id="city"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: city,
                      onChange: (e) => setCity(e.target.value)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="State"
                    id="state"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: parentState,
                      onChange: (e) => setParentState(e.target.value)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Postal Code"
                    id="postal-code"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: postalCode,
                      onChange: (e) => setPostalCode(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

            </CardBody>
            <CardFooter style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Button className={classes.themeButton} color="buttonGradient" onClick={() => onAddParent()}>Submit</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    parentData: state.parentReducer
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addParentRequest,
    editParentRequest
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddParent);