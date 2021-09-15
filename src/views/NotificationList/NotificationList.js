import React, { useState, useEffect, useRef, forwardRef } from "react";
//import React,{useState} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
// core components
import axios from "axios";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Project from "components/Project/Project.js";
import NotificationsTable from 'components/NotificationsTable/NotificationsTable.js'
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllNotification, getNotificationPages } from 'reduxStore/ReduxAction/notificationAction';
import { importChildRequest } from 'reduxStore/ReduxAction/childAction';
import { buttonGradient } from "assets/jss/material-dashboard-react.js";
import _ from 'lodash';
import * as XLSX from 'xlsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import Loader from "react-js-loader";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import Block from '@material-ui/icons/Block';
import DatePicker from "react-datepicker";
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";

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

function NotificationList(props) {
    const { notificationsData, childData } = props;
    const classes = useStyles();
    const history = useHistory();
    const inputFile = useRef(null)
    const [fetchData, setFetchData] = useState([]);
    const [filterDate, setFilterDate] = useState(new Date());

    useEffect(() => {
        (async () => {
            await props.getAllNotification();
        })();
    }, []);

    // useEffect(() => {
    //     setFetchData(appointmentData.appointmentData)
    // }, [appointmentData.appointmentData])

    // useEffect(() => {
    //     const result = _.uniqBy(props.parentData.parentData, 'id');
    //     setFetchData(result);
    // }, [props.parentData.isGetInitialData == true])

    const onAddNotification = () => {
        history.push("/admin/sendNotification");
    }

    const getRecord = () => {
        // const newData = _.uniqBy(props.parentData.parentData, 'id');
        // return [...newData, ...newData]
        return _.uniqBy(props.notificationsData.notificationsData, 'id');
    }

    const onNextPage = () => {
        try {
            const { notificationsData } = props.notificationsData;
            props.getNotificationPages(notificationsData[notificationsData.length - 1])
        } catch (error) {
            console.log(error)
        }
    }

    const onCheckStatus = (selectedData) => {
        // history.push("/admin/notificationStatus");
        history.push({
            pathname: '/admin/notificationStatus',
            state: { selectedData: selectedData }
        });
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="primary">
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={9}>
                                <h4 className={classes.cardTitleWhite}>Notifications List</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Notifications for Eos-danceschool
                                </p>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3} justify="center" container>
                                <Button color="buttonGradient" className={classes.themeButton} onClick={() => onAddNotification()}>Add Notifications</Button>
                            </GridItem>
                            {/* <GridItem xs={12} sm={12} md={1} justify="center" container>
                                <Tooltip title="Filter list">
                                    <DatePicker
                                        selected={filterDate}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        onChange={(date) => onChangeDate(date)}
                                        customInput={<CustomDatePicker />}
                                    />
                                </Tooltip>


                            </GridItem> */}

                            {/* {appointmentData.isFilterOn
                                &&
                                <GridItem xs={12} sm={12} md={1} justify="center" container>
                                    <Tooltip title="Cancel Filter">
                                        <IconButton aria-label="cancel filter list" onClick={() => onCancelFilter()} >
                                            <Block />
                                        </IconButton>
                                    </Tooltip>
                                </GridItem>
                            } */}

                        </GridContainer>
                    </CardHeader>
                    <CardBody>
                        <NotificationsTable
                            tableData={getRecord()}
                            showLoader={notificationsData.showNotificationLoader}
                            onNextPage={() => onNextPage()}
                            onCheckStatus={(selectedData) => onCheckStatus(selectedData)}
                        />
                    </CardBody>
                </Card>
            </GridItem>

        </GridContainer>
    );
}

const mapStateToProps = state => {
    return {
        notificationsData: state.notificationReducer
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getAllNotification,
        getNotificationPages,
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);