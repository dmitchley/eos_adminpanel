import React, { useState, useEffect, useRef } from "react";
//import React,{useState} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
// core components
import axios from "axios";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Project from "components/Project/Project.js";
import TimeslotTable from 'components/TimeslotTable/TimeslotTable.js'
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllTimeSlot, getTimeSlotPages, importTimeSlotRequest } from 'reduxStore/ReduxAction/timeSlotAction';
import { startTimeSlotImport, finishTimeSlotImport } from 'reduxStore/Action/timeSlotAction';
import { getClassList, getLocationList, getTeacherList, importClassStaff, importClassLocation, importClasses, getExistedTimeSlotList } from 'actionStore/FirebaseAction/timeslotAction';
import { getStaffList } from 'actionStore/FirebaseAction/appointmentAction';
import { importChildRequest } from 'reduxStore/ReduxAction/childAction';
import { buttonGradient } from "assets/jss/material-dashboard-react.js";
import _ from 'lodash';
import * as XLSX from 'xlsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import Loader from "react-js-loader";
import moment from 'moment';

const styles = {
    cardCategoryWhite: {

        "&,& a,& a:hover,& a:focus": {
            color: "rgba(0,0,0,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0",
        },
        "& a,& a:hover,& a:focus": {
            color: "#000",
        },
    },
    cardTitleWhite: {
        color: "#000",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "400",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: "#777",
            fontSize: "65%",
            fontWeight: "500",
            lineHeight: "1",
        },
    },
    themeButton: {
        minWidth: "20vh",
        background: 'linear-gradient(0deg, #fe6c44 15%, #a0452c 90%)',
        // marginTop: '55px'
        "@media only screen and (max-width:950px)": {
            marginTop: '15px'
        }
    },
    importButton: {
        minWidth: "20vh",
        background: '#2F5061',
        // marginTop: '55px'
        "@media only screen and (max-width:950px)": {
            marginTop: '15px'
        }
    },
    buttonProgress: {
        color: buttonGradient[0],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
};

const useStyles = makeStyles(styles);

function TimeSlot(props) {
    const { timeSlotData, childData } = props;
    const classes = useStyles();
    const history = useHistory();
    const inputFile = useRef(null)
    const [fetchData, setFetchData] = useState([]);
    useEffect(() => {
        (async () => {
            await props.getAllTimeSlot();
        })();
    }, []);

    // useEffect(() => {
    //     const result = _.uniqBy(props.parentData.parentData, 'id');
    //     setFetchData(result);
    // }, [props.parentData.isGetInitialData == true])

    const onAddTimeSlot = () => {
        history.push("/admin/addTimeSlot");
    }

    const getRecord = () => {
        const validateTimeSlotData = timeSlotData.timeSlotData.map((item) => {
            return { ...item, id: item.timeslot_id }
        })
        const uniqueTimeSlotData = _.uniqBy(validateTimeSlotData, 'id');
        return _.orderBy(uniqueTimeSlotData, ['location_name'], ['asc']);
        // return _.uniqBy(validateTimeSlotData, 'id');
    }

    const onNextPage = () => {
        try {
            const { timeSlotData } = props.timeSlotData;
            // props.getTimeSlotPages(timeSlotData[timeSlotData.length - 1])
        } catch (error) {
            console.log(error)
        }
    }

    // process CSV data
    const processData = dataString => {
        const dataStringLines = dataString.split(/\r\n|\n/);
        const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

        const list = [];
        for (let i = 1; i < dataStringLines.length; i++) {
            const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
            if (headers && row.length == headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    let d = row[j];
                    if (d.length > 0) {
                        if (d[0] == '"')
                            d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] == '"')
                            d = d.substring(d.length - 2, 1);
                    }
                    if (headers[j]) {
                        obj[headers[j]] = d;
                    }
                }

                // remove the blank rows
                if (Object.values(obj).filter(x => x).length > 0) {
                    list.push(obj);
                }
            }
        }

        // prepare columns list from headers
        const columns = headers.map(c => ({
            name: c,
            selector: c,
        }));


        console.log('---- processData -----');
        console.log(list)
        // console.log(columns)

        const firest10 = _.take(list, 8)
        console.log(firest10)
        onRequestImport(list)
        // setData(list);
        // setColumns(columns);
    }

    const addEmptyClass = async (csvClass) => {
        return new Promise(async (resolve, reject) => {
            const classList = await getClassList()

            const classArray = csvClass.map((item) => {
                return {
                    class_name: item,
                }
            })

            const diffBy = _.differenceBy(classArray, classList, 'class_name');
            const validateDiffBy = _.compact(diffBy);
            if (validateDiffBy.length > 0) {
                const uniqueDiffBy = _.uniqBy(validateDiffBy, 'class_name');
                const isClassImport = importClasses(uniqueDiffBy)
                if (isClassImport) {
                    resolve(true)
                }
            } else {
                resolve(true)
            }

        })
    }

    const addEmptyTeacher = async (csvTeacher) => {
        return new Promise(async (resolve, reject) => {
            const staffData = await getStaffList();

            const validateStaffData = staffData.map((item) => {
                return { ...item, fullName: item.fname + ' ' + item.lname }
            })

            const teacherArray = csvTeacher.map((item) => {
                if (item !== '(No teacher)') {
                    const fullName = item.split(' ');
                    return {
                        fullName: item,
                        fname: fullName[0],
                        lname: String(item.substring(fullName[0].length)).trim(),
                        email: ''
                    }
                }
            })

            const validateTeacherArray = _.compact(teacherArray);
            const diffBy = _.differenceBy(validateTeacherArray, validateStaffData, 'fullName');
            const validateDiffBy = _.compact(diffBy);
            if (validateDiffBy.length > 0) {
                const uniqueDiffBy = _.uniqBy(validateDiffBy, 'fullName');
                const isStaffImport = importClassStaff(uniqueDiffBy)
                if (isStaffImport) {
                    resolve(true)
                }
                // console.log(teacherArray)
            } else {
                resolve(true)
            }

        })
    }

    const addEmptyLocation = async (csvLocation) => {
        return new Promise(async (resolve, reject) => {
            const locationData = await getLocationList();

            const locationArray = csvLocation.map((item) => {
                return {
                    location_name: item,
                    location_address: item,
                }
            })

            const diffBy = _.differenceBy(locationArray, locationData, 'location_name');
            const validateDiffBy = _.compact(diffBy);
            if (validateDiffBy.length > 0) {
                const uniqueDiffBy = _.uniqBy(validateDiffBy, 'location_name');
                const isLocationImport = importClassLocation(uniqueDiffBy)
                if (isLocationImport) {
                    resolve(true)
                }
            } else {
                resolve(true)
            }

        })
    }

    const getClassIdByName = (classList, className) => {
        try {
            const filterArray = _.find(classList, function (item) {
                return String(item.class_name).trim().toLowerCase() === String(className).trim().toLowerCase();
            });
            return filterArray.class_id;
        } catch (error) {
            return null
        }

    }

    const getLocationIdByName = (locationList, locationName) => {
        try {
            const filterArray = _.find(locationList, function (item) {
                return String(item.location_name).trim().toLowerCase() === String(locationName).trim().toLowerCase();
            });
            return filterArray.location_id;
        } catch (error) {
            return null
        }

    }

    const getTeacherIdByName = (teacherList, teacherName) => {
        try {
            const filterArray = _.find(teacherList, function (item) {
                return String(item.fname + ' ' + item.lname).trim().toLowerCase() === String(teacherName).trim().toLowerCase();
            });
            return filterArray.teacher_id;
        } catch (error) {
            return null
        }
    }

    const validateTimeSlotRecord = (dataArray) => {
        return new Promise(async (resolve, reject) => {
            const existedTimeSlotData = await getExistedTimeSlotList();

            const diffBy = _.differenceBy(dataArray, existedTimeSlotData, function (obj) {
                return obj.class_id + obj.location_id + obj.teacher_id + obj.start_time + obj.day;
            });
            resolve(diffBy)
        })
    }

    const onRequestImport = async (dataArray) => {
        const sampleObj = dataArray[0];
        const requiredKeys = ['Lesson format', 'Venue', 'Teacher', 'Start Time', 'Duration', 'Days', 'Student Limit']

        const isCsvValid = _.every(requiredKeys, _.partial(_.has, sampleObj));

        if(isCsvValid) {
            props.startTimeSlotImport()
            const csvClass = dataArray.map((item) => item[`Lesson format`])
            const csvTeacher = dataArray.map((item) => item.Teacher)
            const csvLocation = dataArray.map((item) => item.Venue)
            const isClassDataImport = await addEmptyClass(csvClass);
            console.log('---- FINISH CLASS DATA IMPORT -------')
            const isTeacherDataImport = await addEmptyTeacher(csvTeacher);
            console.log('---- FINISH TEACHER DATA IMPORT -------')
            const isLocationDataImport = await addEmptyLocation(csvLocation)
            console.log('---- FINISH LOCATION DATA IMPORT -------')
    
            if (isClassDataImport && isTeacherDataImport && isLocationDataImport) {
                const classList = await getClassList()
                const locationList = await getLocationList()
                const teacherList = await getTeacherList()
    
                const mapDataArray = dataArray.map((item) => {
                    return {
                        class_id: getClassIdByName(classList, item[`Lesson format`]),
                        location_id: getLocationIdByName(locationList, item[`Venue`]),
                        teacher_id: getTeacherIdByName(teacherList, item[`Teacher`]),
                        start_time: moment(item[`Start Time`], ["HH.mm"]).format("hh:mm a"),
                        duration: item[`Duration`],
                        day: item[`Days`],
                        student_limit: item[`Student Limit`]
                    }
                })
    
                const validateMapData = _.uniqBy(mapDataArray, v => [v.class_id, v.location_id, v.teacher_id, v.start_time, v.day].join());
                const validateWithExisting = await validateTimeSlotRecord(validateMapData)
                if(validateWithExisting.length > 0) {
                    await props.importTimeSlotRequest(validateWithExisting);
                } else {
                    await props.finishTimeSlotImport([]);
                }
            } else {
                alert('Something went wrong!!')
            }
        } else {
            alert('Wrong csv import!!')
        }
       
    }

    const onFileChange = event => {
        // Update the state 
        // console.log('----- onFileChange -----');
        // console.log(event.target.files[0])
        // this.setState({ selectedFile: event.target.files[0] });

        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            processData(data);
        };
        reader.readAsBinaryString(file);
    };

    const onImportFile = () => {
        inputFile.current.click();
    }

    const onAddChild = (selectedParent) => {
        // history.push("/admin/addChild");
        history.push({
            pathname: '/admin/addChild',
            state: { selectedParent: selectedParent }
        });
    }

    const onEditParent = (selectedParent) => {
        // history.push("/admin/addChild");
        history.push({
            pathname: '/admin/addParent',
            state: { selectedParent: selectedParent }
        });
    }

    const onSetPassword = (selectedParent) => {
        // history.push("/admin/setPassword");
        history.push({
            pathname: '/admin/setPassword',
            state: { selectedParent: selectedParent }
        });
    }

    const onViewBooking = (selectedClass) => {
        history.push({
            pathname: '/admin/viewBooking',
            state: { selectedClass: selectedClass }
        });
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="primary">
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={8}>
                                <h4 className={classes.cardTitleWhite}>Class List</h4>
                                <p className={classes.cardCategoryWhite}>
                                    ClassList for Eos-danceschool
                                </p>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={2} justify="center" container>
                                {timeSlotData.isImportTimeSlotData
                                    ?
                                    <Button color="buttonGradient" className={classes.importButton}>
                                        <Loader type="spinner-default" bgColor={"#FFFFFF"} size={20} />
                                    </Button>
                                    :
                                    <Button color="buttonGradient" className={classes.importButton} onClick={() => onImportFile()}>Import Class</Button>
                                }
                            </GridItem>
                            <input type='file' accept=".csv,.xlsx,.xls" id='file' ref={inputFile} onChange={(event) => onFileChange(event)} style={{ display: 'none' }} />
                            <GridItem xs={12} sm={12} md={2} justify="center" container>
                                <Button color="buttonGradient" className={classes.themeButton} onClick={() => onAddTimeSlot()}>Add TimeSlot</Button>
                            </GridItem>
                        </GridContainer>
                    </CardHeader>
                    <CardBody>
                        <TimeslotTable
                            tableData={getRecord()}
                            onNextPage={() => onNextPage()}
                            showLoader={timeSlotData.showTimeslotLoader}
                            onViewBooking={(selectedClass) => onViewBooking(selectedClass)}
                            onAddChild={(selectedParent) => onAddChild(selectedParent)}
                            onEditParent={(selectedParent) => onEditParent(selectedParent)}
                            onSetPassword={(selectedParent) => onSetPassword(selectedParent)}
                        />
                    </CardBody>
                </Card>
            </GridItem>

        </GridContainer>
    );
}

const mapStateToProps = state => {
    return {
        timeSlotData: state.timeSlotReducer
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getAllTimeSlot,
        getTimeSlotPages,
        importTimeSlotRequest,
        startTimeSlotImport,
        finishTimeSlotImport,
        importChildRequest
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(TimeSlot);