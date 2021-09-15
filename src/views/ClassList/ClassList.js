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
import ClassesTable from 'components/ClassesTable/ClassesTable.js'
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllTimeSlot, getTimeSlotPages, importTimeSlotRequest } from 'reduxStore/ReduxAction/timeSlotAction';
import { importClassListFB, getClassList, importClassStaff, importClassLocation } from 'actionStore/FirebaseAction/classListAction';
import { getStaffList, getLocationList } from 'actionStore/FirebaseAction/appointmentAction';
import { importChildRequest } from 'reduxStore/ReduxAction/childAction';
import { buttonGradient } from "assets/jss/material-dashboard-react.js";
import _ from 'lodash';
import * as XLSX from 'xlsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import Loader from "react-js-loader";

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

function ClassList(props) {
    const { timeSlotData, childData } = props;
    const classes = useStyles();
    const history = useHistory();
    const inputFile = useRef(null);
    const [isShowLoader, setShowLoader] = useState(false);
    const [fetchData, setFetchData] = useState([]);
    const [isImportData, setIsImportData] = useState(false);

    useEffect(() => {
        getInitialClasses();
    }, [])

    const getInitialClasses = async () => {
        setShowLoader(true)
        const classData = await getClassList();
        setFetchData(classData)
        setShowLoader(false)
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

        const firest10 = _.take(list, 2)
        console.log(firest10)
        onRequestImport(list)
        // setData(list);
        // setColumns(columns);
    }

    const validateClassRecord = (dataArray) => {
        return new Promise(async (resolve, reject) => {
            const mapDataArray = dataArray.map((item) => {
                return { ...item, class_name: item[`Standard`] }
            })

            let diffBy = _.differenceBy(mapDataArray, fetchData, 'class_name');
            const uniqueDiffBy = _.uniqBy(diffBy, 'class_name');
            console.log(uniqueDiffBy)

            resolve(uniqueDiffBy)
        })
    }

    const addEmptyTeacher = async (csvTeacher) => {
        return new Promise(async (resolve, reject) => {
            const classData = await getStaffList();

            const validateClassData = classData.map((item) => {
                return { ...item, fullName: item.fname + ' ' + item.lname }
            })

            const teacherArray = csvTeacher.map((item) => {
                if (item !== '(No teacher)') {
                    const fullName = item.split(' ');
                    return {
                        fullName: item,
                        fname: fullName[0],
                        lname: fullName[fullName.length - 1],
                        email: ''
                    }
                }
            })


            const diffBy = _.differenceBy(teacherArray, validateClassData, 'fullName');
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

    const onRequestImport = async (dataArray) => {
        const csvTeacher = dataArray.map((item) => item.Teacher)
        const csvLocation = dataArray.map((item) => item.Venue)
        const isTeacherDataImport = await addEmptyTeacher(csvTeacher);
        console.log('---- FINISH TEACHER DATA IMPORT -------')
        const isLocationDataImport = await addEmptyLocation(csvLocation)
        console.log('---- FINISH LOCATION DATA IMPORT -------')

        if (isTeacherDataImport && isLocationDataImport) {
            const validClassesData = await validateClassRecord(dataArray)
            if (validClassesData.length > 0) {
                const classListData = await importClassListFB(validClassesData);
                setIsImportData(false);
                const sortArray = _.orderBy([...fetchData, ...classListData], ['class_name'], ['asc']);
                setFetchData(sortArray);
            } else {
                setIsImportData(false);
            }
        } else {
            alert('Something went wrong!!')
        }
    }

    const onFileChange = event => {
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
            setIsImportData(true);
            processData(data);
        };
        reader.readAsBinaryString(file);
    };

    const onImportFile = () => {
        inputFile.current.click();
    }

    const onViewBooking = (selectedClass) => {
        console.log('----- onViewBooking -----');
        console.log(selectedClass)
        const { class_id } = selectedClass;
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
                            <GridItem xs={12} sm={12} md={9}>
                                <h4 className={classes.cardTitleWhite}>Class List</h4>
                                <p className={classes.cardCategoryWhite}>
                                    ClassList for Eos-danceschool
                                </p>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3} justify="center" container>
                                {isImportData
                                    ?
                                    <Button color="buttonGradient" className={classes.importButton}>
                                        <Loader type="spinner-default" bgColor={"#FFFFFF"} size={20} />
                                    </Button>
                                    :
                                    <Button color="buttonGradient" className={classes.importButton} onClick={() => onImportFile()}>Import ClassList</Button>
                                }
                            </GridItem>
                            <input type='file' accept=".csv,.xlsx,.xls" id='file' ref={inputFile} onChange={(event) => onFileChange(event)} style={{ display: 'none' }} />
                        </GridContainer>
                    </CardHeader>
                    <CardBody>
                        <ClassesTable
                            showLoader={isShowLoader}
                            tableData={fetchData}
                            rowLength={fetchData.length}
                            onViewBooking={(selectedClass) => onViewBooking(selectedClass)}
                        // onNextPage={() => onNextPage()}
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
        importChildRequest
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ClassList);