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
import { addTimeSlotRequest } from 'reduxStore/ReduxAction/timeSlotAction';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import avatar from "assets/img/faces/marc.jpg";
import { getClassList, getLocationList, getTeacherList } from 'actionStore/FirebaseAction/timeslotAction';
import moment from 'moment';

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
  { title: 'Sunday', value: 'Sun' },
  { title: 'Monday', value: 'Mon' },
  { title: 'Tuesday', value: 'Tue' },
  { title: 'Wednesday', value: 'Wed' },
  { title: 'Thursday', value: 'Thu' },
  { title: 'Friday', value: 'Fri' },
  { title: 'Saturday', value: 'Sat' },
];

function AddTimeSlot(props) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [classList, setClassList] = useState([]);
  const [classType, setClassType] = useState('');

  const [locationList, setLocationList] = useState([]);
  const [schoolLocation, setSchoolLocation] = useState('');

  const [teacherList, setTeacherList] = useState([]);
  const [teacher, setTeacher] = useState('');

  const [weekDay, setWeekDays] = useState('');
  const [tieSlot, setTimeSlot] = useState(new Date());
  const [duration, setDuration] = useState('');

  useEffect(() => {
    getClasses();
    getLocation();
    getTeacher();
  }, [])

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

  const onAddSlot = async () => {
    const data = {
      class_id: classType,
      location_id: schoolLocation,
      teacher_id: teacher,
      day: weekDay,
      start_time: moment(tieSlot).format('h:mm a'),
      duration: duration,
    }

    if (classType != '' && schoolLocation != '' && teacher != '' && weekDay != '' && tieSlot != '' && duration != '') {
      await props.addTimeSlotRequest(data);
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
              <h4 className={classes.cardTitleWhite}>Add TimeSlot</h4>
              <p className={classes.cardCategoryWhite}>Add timeSlot for teachers</p>
            </CardHeader>
            <CardBody>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl required className={classes.formControl}>
                    <InputLabel id="demo-simple-select-required-label">Class Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      value={classType}
                      onChange={(event) => setClassType(event.target.value)}
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
                    <InputLabel id="demo-simple-select-required-label">WeekDays</InputLabel>
                    <Select
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      value={weekDay}
                      onChange={(event) => setWeekDays(event.target.value)}
                      className={classes.selectEmpty}
                    >
                      {weekDays.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.title}
                        </MenuItem>
                      ))}
                    </Select>
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
                        label="Time picker"
                        value={tieSlot}
                        onChange={(date) => setTimeSlot(date)}
                        KeyboardButtonProps={{
                          'aria-label': 'change time',
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl required className={classes.formControl}>
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
                  </FormControl>
                </GridItem>
              </GridContainer>


            </CardBody>
            <CardFooter style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Button className={classes.themeButton} color="buttonGradient" onClick={() => onAddSlot()}>Submit</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div >
  );
}

const mapStateToProps = state => {
  return {
    parentData: state.parentReducer
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addTimeSlotRequest
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddTimeSlot);