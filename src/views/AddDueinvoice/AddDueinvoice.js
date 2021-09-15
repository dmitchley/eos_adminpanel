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
import { requestCustomerData, addInvoiceRequest } from 'reduxStore/ReduxAction/dueInvoiceAction';
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
import { getParentChild } from 'actionStore/FirebaseAction/appointmentAction';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getAllParentData } from 'actionStore/FirebaseAction/dueInvoiceAction';

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

const booleanArray = [
  'true',
  'false'
];

function AddDueinvoice(props) {
  const { dueInvoiceData } = props;
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  // const [email, setEmail] = useState('');
  const [parentList, setParentList] = useState([]);
  const [selectedParent, setSelectedParent] = useState('');
  const [email, setEmail] = useState('bartsmith@yopmail.com');

  const [studList, setStudList] = useState([]);
  const [selectedStud, setSelectedStud] = useState('');

  const [classList, setClassList] = useState([]);
  const [classType, setClassType] = useState('');

  const [selectedDay, setSelectedDays] = useState(new Date());
  const [tieSlot, setTimeSlot] = useState(new Date());
  const [isPaid, setIsPaid] = useState('false');
  const [isVerified, setIsVerified] = useState('false');


  useEffect(() => {
    getParentList();
    getClasses();
  }, [])

  const getParentList = async () => {
    const parentList = await getAllParentData();
    setParentList(parentList);
  }

  const getClasses = async () => {
    const classList = await getClassList();
    setClassList(classList)
  }

  useEffect(() => {
    if (!(_.isEmpty(dueInvoiceData.customerData, true))) {
      getChildList();
    }
  }, [dueInvoiceData.customerData])

  const getChildList = async () => {
    const { parent_id } = dueInvoiceData.customerData;
    const studList = await getParentChild(parent_id);
    setStudList(studList)
  }

  const onDueInvoice = async () => {
    const { parent_id, noti_token } = dueInvoiceData.customerData;
    const data = {
      noti_token: noti_token,
      payload: {
        parent_id: parent_id,
        children_id: selectedStud,
        class_id: classType,
        is_paid: false,
        is_verify: false,
        date: moment(selectedDay).format('DD/MM/YYYY'),
        time: moment(tieSlot).format('hh:mm a'),
        created_dt: moment().toString(),
        updated_dt: moment().toString()
      }
    }

    if (selectedStud != '' && classType != '' && selectedDay != '' && tieSlot != '') {
      await props.addInvoiceRequest(data);
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

  const onRequestCustomerData = () => {
    const { parent_id } = selectedParent;
    // console.clear();
    // console.log(selectedParent)
    props.requestCustomerData(parent_id)
  }

  const onSelectClass = async (event) => {
    setClassType(event.target.value)
  }

  const defaultProps = {
    options: parentList,
    getOptionLabel: (option) => option.parentName,
  };

  return (
    <div>
      <GridContainer justify="center" container>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Add Due Invoice</h4>
              <p className={classes.cardCategoryWhite}>Add Due Invoice for student</p>
            </CardHeader>
            <CardBody>

              {/* {_.isEmpty(dueInvoiceData.customerData, true)
                ?
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <Autocomplete
                      {...defaultProps}
                      id="select-parent"
                      value={selectedParent}
                      onChange={(event, newValue) => setSelectedParent(newValue)}
                      renderInput={(params) => <TextField {...params} label="select parent" margin="normal" />}
                    />
                  </GridItem>
                </GridContainer>
                : */}
              <>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <FormControl required className={classes.formControl}>
                      <Autocomplete
                        {...defaultProps}
                        id="select-parent"
                        value={selectedParent}
                        onChange={(event, newValue) => setSelectedParent(newValue)}
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
                            'aria-label': 'change time',
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </FormControl>
                  </GridItem>
                </GridContainer>

                {/* <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <FormControl required className={classes.formControl}>
                      <InputLabel id="demo-simple-select-required-label">isPaid</InputLabel>
                      <Select
                        labelId="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        value={isPaid}
                        onChange={(event) => setIsPaid(event.target.value)}
                        className={classes.selectEmpty}
                      >
                        {booleanArray.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer>

                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <FormControl required className={classes.formControl}>
                      <InputLabel id="demo-simple-select-required-label">has verified</InputLabel>
                      <Select
                        labelId="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        value={isVerified}
                        onChange={(event) => setIsVerified(event.target.value)}
                        className={classes.selectEmpty}
                      >
                        {booleanArray.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                </GridContainer> */}
              </>
              {/* } */}

            </CardBody>
            <CardFooter style={{ alignItems: 'center', justifyContent: 'center' }}>
              {/* {_.isEmpty(dueInvoiceData.customerData, true)
                ?
                <Button className={classes.themeButton} color="buttonGradient" onClick={() => onRequestCustomerData()}>Submit</Button>
                : */}
              <Button className={classes.themeButton} color="buttonGradient" onClick={() => onDueInvoice()}>Submit</Button>
              {/* } */}
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div >
  );
}

const mapStateToProps = state => {
  return {
    dueInvoiceData: state.dueInvoiceReducer
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addInvoiceRequest,
    requestCustomerData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddDueinvoice);