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
import { addChildrenRequest, editChildRequest } from 'reduxStore/ReduxAction/childAction';

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

function AddChild(props) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [isEdit, setIsEdit] = useState(false);

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [startDate, setStartdate] = useState('');
  const [isActive, setIsactive] = useState('');
  const [stdId, setStdId] = useState('');
  const [level, setLevel] = useState('');
  const [lastGraded, setLaseGraded] = useState('');
  const [medical, setMedical] = useState('');
  const [refBy, setRefBy] = useState('');
  const [school, setSchool] = useState('');
  const [notes, setNotes] = useState('');

  // const [fname, setFname] = useState('Cleo');
  // const [lname, setLname] = useState('Smith');
  // const [dob, setDob] = useState('01/01/2000');
  // const [age, setAge] = useState('21');
  // const [gender, setGender] = useState('Male');
  // const [startDate, setStartdate] = useState('01/01/2021');
  // const [isActive, setIsactive] = useState(true);
  // const [stdId, setStdId] = useState('');
  // const [level, setLevel] = useState('');
  // const [lastGraded, setLaseGraded] = useState('Never');
  // const [medical, setMedical] = useState('');
  // const [refBy, setRefBy] = useState('');
  // const [school, setSchool] = useState('');
  // const [notes, setNotes] = useState('');

  useEffect(() => {
    try {
      const selectedChild = location.state.selectedChild;
      console.clear();
      console.log('----- selectedChild -----');
      console.log(selectedChild)
      const {
        fname,
        lname,
        dob,
        age,
        gender,
        start_date,
        is_active,
        standard_id,
        level,
        last_garded,
        medical,
        reference_by,
        school,
        notes,
      } = selectedChild;
      if (selectedChild) {
        setIsEdit(true);

        setFname(fname)
        setLname(lname)
        setDob(dob)
        setAge(age)
        setGender(gender)
        setStartdate(start_date)
        setIsactive(is_active)
        setStdId(standard_id)
        setLevel(level)
        setLaseGraded(last_garded)
        setMedical(medical)
        setRefBy(refBy)
        setSchool(school)
        setNotes(notes)
      }
    } catch (error) {
      return;
    }
  }, [])

  const onAddChild = async () => {
    const selectedParent = location.state.selectedParent;
    const { parent_id } = selectedParent;

    console.log('parent_id')
    console.log(parent_id)
    const data = {
      fname: fname,
      lname: lname,
      dob: dob,
      age: age,
      gender: gender,
      start_date: startDate,
      is_active: isActive,
      standard_id: stdId,
      level: level,
      last_garded: lastGraded,
      medical: medical,
      reference_by: refBy,
      school: school,
      notes: notes,
      parent_id: parent_id
    }

    await props.addChildrenRequest(data);
    history.goBack();
  }

  const onEditChild = async () => {
    const selectedChild = location.state.selectedChild;
    const { children_id } = selectedChild;

    const data = {
      fname: fname,
      lname: lname,
      dob: dob,
      age: age,
      gender: gender,
      start_date: startDate,
      is_active: isActive,
      standard_id: stdId,
      level: level,
      last_garded: lastGraded,
      medical: medical,
      reference_by: refBy,
      school: school,
      notes: notes
    }

    if (fname != '' && lname != '' && dob != '' && age != '' && gender != '' && startDate != '' && isActive != '' && stdId != '' &&
      level != '' && lastGraded != '' && medical != '' && refBy != '' && school != '' && notes != '') {
      await props.editChildRequest(children_id, data);
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
              <h4 className={classes.cardTitleWhite}>Add Child</h4>
              <p className={classes.cardCategoryWhite}>Add child profile</p>
            </CardHeader>
            <CardBody>
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
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Date of Birth"
                    id="child-dob"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: dob,
                      onChange: (e) => setDob(e.target.value)
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Age"
                    id="child-age"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: age,
                      onChange: (e) => setAge(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Gender"
                    id="child-gender"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: gender,
                      onChange: (e) => setGender(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Start Date"
                    id="child-startDate"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: startDate,
                      onChange: (e) => setStartdate(e.target.value)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Active"
                    id="child-active"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: isActive,
                      onChange: (e) => setIsactive(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="School"
                    id="child-school"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: school,
                      onChange: (e) => setSchool(e.target.value)
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Standard Id"
                    id="child-stdId"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: stdId,
                      onChange: (e) => setStdId(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Level"
                    id="child-level"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: level,
                      onChange: (e) => setLevel(e.target.value)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Last graded"
                    id="child-lastGrade"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: lastGraded,
                      onChange: (e) => setLaseGraded(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Medical"
                    id="child-medical"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: medical,
                      onChange: (e) => setMedical(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Reference by"
                    id="child-refBy"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: refBy,
                      onChange: (e) => setRefBy(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Notes"
                    id="child-notes"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 2,
                      value: notes,
                      onChange: (e) => setNotes(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

            </CardBody>
            <CardFooter style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Button className={classes.themeButton} color="buttonGradient" onClick={() => isEdit ? onEditChild() : onAddChild()}>Submit</Button>
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
    addChildrenRequest,
    editChildRequest
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddChild);