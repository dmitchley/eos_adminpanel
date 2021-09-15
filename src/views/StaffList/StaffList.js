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
import StaffTable from 'components/StaffTable/StaffTable.js'
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllTimeSlot, getTimeSlotPages, importTimeSlotRequest } from 'reduxStore/ReduxAction/timeSlotAction';
import { importStaffListFB, getStaffList, deleteTeacherFB } from 'actionStore/FirebaseAction/staffListAction'
import { importChildRequest } from 'reduxStore/ReduxAction/childAction';
import { buttonGradient } from "assets/jss/material-dashboard-react.js";
import _ from 'lodash';
import * as XLSX from 'xlsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import Loader from "react-js-loader";
import AlertOption from 'components/AlertOption/AlertOption';

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

function StaffList(props) {
    const { timeSlotData, childData } = props;
    const classes = useStyles();
    const history = useHistory();
    const inputFile = useRef(null)
    const [isShowLoader, setShowLoader] = useState(false);
    const [fetchData, setFetchData] = useState([]);
    const [isImportData, setIsImportData] = useState(false);
    const [isOpenAlert, setIsopenAlert] = useState(false);
    const [deleteTeacherId, setDeleteTeacherId] = useState('');

    useEffect(() => {
        getInitialClasses();
    }, [])

    const getInitialClasses = async () => {
        setShowLoader(true)
        const classData = await getStaffList();
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

        // const firest10 = _.take(list, 8)
        // console.log(firest10)
        onRequestImport(list)
        // setData(list);
        // setColumns(columns);
    }

    const validateStaffRecord = (dataArray) => {
        return new Promise(async (resolve, reject) => {
            const mapDataArray = dataArray.map((item) => {
                return { ...item, email: item.Email, fname: item[`First Name`], lname: item[`Last Name`] }
            })
            const diffBy = _.differenceBy(mapDataArray, fetchData, function (obj) {
                return obj.fname + obj.lname;
            });
            resolve(diffBy)
        })
    }

    const onRequestImport = async (dataArray) => {
        // await props.importTimeSlotRequest(dataArray);
        const sampleObj = dataArray[0];
        const requiredKeys = ['First Name', 'Last Name', 'Email']

        const isCsvValid = _.every(requiredKeys, _.partial(_.has, sampleObj));
        if (isCsvValid) {
            const validStaffData = await validateStaffRecord(dataArray)
            if (validStaffData.length > 0) {
                const classListData = await importStaffListFB(validStaffData);
                setIsImportData(false);
                setFetchData([...fetchData, ...classListData]);
            } else {
                setIsImportData(false);
            }
        } else {
            alert('Wrong csv import!!')
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

    const onDeleteStaff = (selectedStaff) => {
        const { teacher_id } = selectedStaff;
        setDeleteTeacherId(teacher_id)
        setIsopenAlert(true)
    }

    const onAlertOk = async () => {
        const deletedTeacherId = await deleteTeacherFB(deleteTeacherId)
        if (deletedTeacherId) {
            const filterStaffList = _.filter(fetchData, item => item.teacher_id !== deleteTeacherId);
            setFetchData(filterStaffList);
            setIsopenAlert(false)
            setDeleteTeacherId('')
        }
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <AlertOption
                        isOpen={isOpenAlert}
                        alertTitle={'Are you sure you want to delete this teacher?'}
                        alertDescription={''}
                        okLabel={'Yes'}
                        closeLabel={'No'}
                        handleClose={() => setIsopenAlert(false)}
                        handleClickOpen={() => onAlertOk()}
                    />
                    <CardHeader color="primary">
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={9}>
                                <h4 className={classes.cardTitleWhite}>Staff List</h4>
                                <p className={classes.cardCategoryWhite}>
                                    StaffList for Eos-danceschool
                                </p>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3} justify="center" container>
                                {isImportData
                                    ?
                                    <Button color="buttonGradient" className={classes.importButton}>
                                        <Loader type="spinner-default" bgColor={"#FFFFFF"} size={20} />
                                    </Button>
                                    :
                                    <Button color="buttonGradient" className={classes.importButton} onClick={() => onImportFile()}>Import StaffList</Button>
                                }
                            </GridItem>
                            <input type='file' accept=".csv,.xlsx,.xls" id='file' ref={inputFile} onChange={(event) => onFileChange(event)} style={{ display: 'none' }} />
                        </GridContainer>
                    </CardHeader>
                    <CardBody>
                        <StaffTable
                            tableData={fetchData}
                            showLoader={isShowLoader}
                            rowLength={fetchData.length}
                            onDeleteStaff={(selectedData) => onDeleteStaff(selectedData)}
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
export default connect(mapStateToProps, mapDispatchToProps)(StaffList);