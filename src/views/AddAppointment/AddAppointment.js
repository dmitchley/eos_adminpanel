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
import { requestCustomerData, addAppointmentRequest } from 'reduxStore/ReduxAction/appointmentAction';
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
import { getParentChild, getAllParentData, getTimeSlotByPayload } from 'actionStore/FirebaseAction/appointmentAction';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

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

function AddAppointment(props) {
  const { appointmentData } = props;
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  // const [email, setEmail] = useState('');
  const [email, setEmail] = useState('bartsmith@yopmail.com');
  const [parentList, setParentList] = useState([]);
  const [selectedParent, setSelectedParent] = useState('');

  const [studList, setStudList] = useState([]);
  const [selectedStud, setSelectedStud] = useState('');

  const [bookType, setBookType] = useState('');

  const [classList, setClassList] = useState([]);
  const [classType, setClassType] = useState('');

  const [locationList, setLocationList] = useState([]);
  const [schoolLocation, setSchoolLocation] = useState('');

  const [teacherList, setTeacherList] = useState([]);
  const [teacher, setTeacher] = useState('');

  const [selectedDay, setSelectedDays] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('');
  const [duration, setDuration] = useState('');
  const [timeSlotList, setTimeSlotList] = useState([]);

  useEffect(() => {
    getParentList();
    getClasses();
    getLocation();
    getTeacher();
  }, [])

  const getParentList = async () => {
    const parentList = await getAllParentData();
    setParentList(parentList);
  }

  const getClasses = async () => {
    const classList = await getClassList();
    setClassList(classList)
  }

  const getLocation = async () => {
    const locationList = await getLocationList();
    setLocationList(locationList)
  }

  const getTeacher = async () => {
    const teacherList = await getTeacherList();
    setTeacherList(teacherList)
  }

  useEffect(() => {
    if (!(_.isEmpty(appointmentData.customerData, true))) {
      getChildList();
    }
  }, [appointmentData.customerData])

  const getChildList = async () => {
    const { parent_id } = selectedParent;
    const studList = await getParentChild(parent_id);
    setStudList(studList)
  }

  const onBookAppointment = async () => {
    const { parentType, email, firstName, lastName, noti_token } = selectedParent;
    const data = {
      booking_type: bookType,
      customer_type: parentType,
      customer_email: email,
      customer_name: firstName + ' ' + lastName,
      children_id: selectedStud,
      class_id: classType,
      location_id: schoolLocation,
      teacher_id: teacher,
      date: moment(selectedDay).format('DD/MM/YYYY'),
      day: moment(selectedDay).format('ddd'),
      start_time: moment(moment(timeSlot, 'hh:mm')).format('hh:mm a'),
      // start_time: moment(moment('12:00', 'hh:mm')).format('hh:mm a'),
      // duration: parseInt(duration),
      created_dt: moment().toString()
    }

    if (bookType != '' && selectedStud != '' && classType != '' && schoolLocation != '' && teacher != '' && selectedDay != '' && timeSlot != '') {
      const appointmentData = {
        noti_token: noti_token,
        payload: data
      }
      await props.addAppointmentRequest(appointmentData);
      history.goBack();
    } else {
      alert('All fields are required')
    }
  }

  useEffect(() => {
    if (selectedParent != '') {
      onRequestCustomerData()
    }
  }, [selectedParent])

  const getTimeSlotAsReq = async () => {
    const validateDay = moment(selectedDay).format('ddd');
    const dataPayload = {
      class_id: classType,
      location_id: schoolLocation,
      teacher_id: teacher,
      timeSlot: validateDay,
    }
    const timeSlotArray = await getTimeSlotByPayload(dataPayload);
    setTimeSlotList(timeSlotArray)
  }

  useEffect(() => {
    if (classType != '' && schoolLocation != '' && teacher != '' && selectedDay != '') {
      getTimeSlotAsReq()
    }
  }, [selectedDay])

  const onRequestCustomerData = () => {
    const { parent_id } = selectedParent;
    props.requestCustomerData(parent_id)
    getChildList();
  }

  const onSelectClass = async (event) => {
    const booking_type = await classList.filter((item) => item.class_id === event.target.value);
    const { class_name } = booking_type[0];
    console.log(class_name)

    setBookType(class_name)
    setClassType(event.target.value)
  }

  const defaultProps = {
    options: parentList,
    getOptionLabel: (option) => option.parentName,
  };

  const defaultTimeSlotProps = {
    options: timeSlotList,
    getOptionLabel: (option) => option.start_time,
  };

  return (
    <div>
      <GridContainer justify="center" container>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Add Appointment</h4>
              <p className={classes.cardCategoryWhite}>Add appointment for student</p>
            </CardHeader>
            <CardBody>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl required className={classes.formControl}>
                    <Autocomplete
                      {...defaultProps}
                      id="select-parent"
                      value={selectedParent}
                      onChange={(event, newValue) => {
                        if (newValue !== null) {
                          setSelectedParent(newValue)
                        }
                      }}
                      renderInput={(params) => <TextField {...params} label="Select parent" margin="normal" />}
                    />
                  </FormControl>
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl required className={classes.formControl}>
                    <InputLabel id="demo-simple-select-required-label">Select Child</InputLabel>
                    <Select
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      value={selectedStud}
                      onChange={(event) => setSelectedStud(event.target.value)}
                      className={classes.selectEmpty}
                    >
                      {studList.map((item) => (
                        <MenuItem key={item.children_id} value={item.children_id}>
                          {item.fname} {item.lname}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* <FormHelperText>Required</FormHelperText> */}
                  </FormControl>
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl required className={classes.formControl}>
                    <InputLabel id="demo-simple-select-required-label">Class Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      value={classType}
                      onChange={(event) => onSelectClass(event)}
                      className={classes.selectEmpty}
                    >
                      {/* <MenuItem value="">
                        <em>None</em>
                      </MenuItem> */}
                      {classList.map((item) => (
                        <MenuItem key={item.class_id} value={item.class_id}>
                          {item.class_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* <FormHelperText>Required</FormHelperText> */}
                  </FormControl>
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl required className={classes.formControl}>
                    <InputLabel id="demo-simple-select-required-label">Location</InputLabel>
                    <Select
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      value={schoolLocation}
                      onChange={(event) => setSchoolLocation(event.target.value)}
                      className={classes.selectEmpty}
                    >
                      {locationList.map((item) => (
                        <MenuItem key={item.location_id} value={item.location_id}>
                          {item.location_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* <FormHelperText>Required</FormHelperText> */}
                  </FormControl>
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl required className={classes.formControl}>
                    <InputLabel id="demo-simple-select-required-label">Teacher</InputLabel>
                    <Select
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      value={teacher}
                      onChange={(event) => setTeacher(event.target.value)}
                      className={classes.selectEmpty}
                    >
                      {teacherList.map((item) => (
                        <MenuItem key={item.teacher_id} value={item.teacher_id}>
                          {item.fname} {item.lname}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* <FormHelperText>Required</FormHelperText> */}
                  </FormControl>
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


              {/* <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl required className={classes.formControl}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        label="Appointment Time"
                        format="hh:mm a"
                        value={timeSlot}
                        onChange={(date) => setTimeSlot(date)}
                        KeyboardButtonProps={{
                          'aria-label': 'change time',
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>
                </GridItem>
              </GridContainer> */}

              {/* <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Duration (in minutes)"
                    id="timeslot-duration"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: duration,
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
              </GridContainer> */}
              {/* <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl required className={classes.formControl}>
                    <Autocomplete
                      {...defaultTimeSlotProps}
                      id="select-time"
                      value={timeSlot}
                      onChange={(event, newValue) => {
                        if (newValue !== null) {
                          setTimeSlot(newValue)
                        }
                      }}
                      renderInput={(params) => <TextField {...params} label="Appointment Time" margin="normal" />}
                    />
                  </FormControl>
                </GridItem>
              </GridContainer> */}
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl required className={classes.formControl}>
                    <InputLabel id="demo-simple-select-required-label">Appointment Time</InputLabel>
                    {timeSlotList.length > 0
                      ?
                      <Select
                        labelId="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        value={timeSlot}
                        onChange={(event) => {

                          setTimeSlot(String(event.target.value))
                        }}
                        className={classes.selectEmpty}
                      >
                        {timeSlotList.map((item) => (
                          <MenuItem key={item.start_time} value={item.start_time}>
                            {item.start_time}
                          </MenuItem>
                        ))}
                      </Select>
                      :
                      <Select
                        labelId="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        value={timeSlot}
                        onChange={(event) => {
                          setTimeSlot(String(event.target.value))
                        }}
                        className={classes.selectEmpty}
                      >
                        <MenuItem value={""}>No time slots available</MenuItem>
                      </Select>
                    }

                    {/* <FormHelperText>Required</FormHelperText> */}
                  </FormControl>
                </GridItem>
              </GridContainer>

            </CardBody>
            <CardFooter style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Button className={classes.themeButton} color="buttonGradient" onClick={() => onBookAppointment()}>Submit</Button>
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
    addAppointmentRequest,
    requestCustomerData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddAppointment);