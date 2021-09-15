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
import { requestCustomerData, editAppointmentRequest } from 'reduxStore/ReduxAction/appointmentAction';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import DateFnsUtils from '@date-io/date-fns';
import _ from 'lodash';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers';
import avatar from "assets/img/faces/marc.jpg";
import { getClassList, getLocationList, getTeacherList } from 'actionStore/FirebaseAction/timeslotAction';
import { getParentChild, getChildData, getClassData, getLocationData, getTeacherData, getParentById } from 'actionStore/FirebaseAction/appointmentAction';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
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
  formControl: {
    margin: theme.spacing(1),
    width: '100%'
    // minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
})
);

const weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function EditAppointment(props) {
  const { appointmentData } = props;
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [selectedStud, setSelectedStud] = useState('');
  const [classType, setClassType] = useState('');
  const [schoolLocation, setSchoolLocation] = useState('');
  const [teacher, setTeacher] = useState('');

  const [selectedDay, setSelectedDays] = useState(new Date());
  const [tieSlot, setTimeSlot] = useState();
  const [duration, setDuration] = useState('');

  useEffect(() => {
    setInitialData()
  }, [])

  const setInitialData = async () => {
    const oldAppointment = location.state.selectedAppointment;
    const { 
      children_id,
      class_id,
      location_id,
      teacher_id,
      date,
      start_time,
      duration
    } = oldAppointment;

    const childData = await getChildData(children_id);
    const classData = await getClassData(class_id);
    const locationData = await getLocationData(location_id);
    const teacherData = await getTeacherData(teacher_id);

    const validateTime = new moment(start_time, "hh:mm a").utc();
    const validateDate = new moment(date, "DD/MM/YYYY");

    setSelectedStud(childData.fname + ' ' + childData.lname);
    setClassType(classData.class_name)
    setSchoolLocation(locationData.location_name)
    setTeacher(teacherData.fname + ' ' + teacherData.lname);
    setSelectedDays(validateDate)
    setTimeSlot(validateTime)
    setDuration(duration)
  }

  const onEditAppointment = async () => {
    const oldAppointment = location.state.selectedAppointment;
    const { booking_id, parent_id } = oldAppointment;
    const parentData = await getParentById(parent_id);
    const { noti_token } = parentData;
    const data = {
      date: moment(selectedDay).format('DD/MM/YYYY'),
      start_time: moment(tieSlot).format('hh:mm a'),
      updated_dt: moment().toString()
    }

    await props.editAppointmentRequest(booking_id, noti_token, data);
    history.goBack();
  }

  return (
    <div>
      <GridContainer justify="center" container>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Appointment</h4>
              <p className={classes.cardCategoryWhite}>Edit appointment of student</p>
            </CardHeader>
            <CardBody>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Student"
                    id="student"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: selectedStud,
                      readOnly: true,
                      onChange: (e) => setSelectedStud(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Class Type"
                    id="classType"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: classType,
                      readOnly: true,
                      onChange: (e) => setClassType(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Location"
                    id="location"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: schoolLocation,
                      readOnly: true,
                      onChange: (e) => setSchoolLocation(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Teacher"
                    id="teacher"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: teacher,
                      readOnly: true,
                      onChange: (e) => setTeacher(e.target.value)
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl required className={classes.formControl}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Appointment Date"
                        format="dd/MM/yyyy"
                        value={selectedDay}
                        onChange={(date) => setSelectedDays(date)}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>
                </GridItem>
              </GridContainer>


              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl required className={classes.formControl}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        label="Appointment Time"
                        format="hh:mm a"
                        value={tieSlot}
                        onChange={(date) => setTimeSlot(date)}
                        KeyboardButtonProps={{
                          'aria-label': 'Select time',
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Duration (in minutes)"
                    id="timeslot-duration"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: duration,
                      readOnly: true,
                      type: "number",
                      min: 1,
                      onChange: (e) => {
                        e.target.value < 0
                          ? setDuration(0)
                          : setDuration(e.target.value)
                      }

                    }}
                  />
                </GridItem>
              </GridContainer>

            </CardBody>
            <CardFooter style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Button className={classes.themeButton} color="buttonGradient" onClick={() => onEditAppointment()}>Submit</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div >
  );
}

const mapStateToProps = state => {
  return {
    appointmentData: state.appointmentReducer
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    editAppointmentRequest,
    requestCustomerData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(EditAppointment);