import React, { useState, useEffect, useRef, forwardRef } from "react";
//import React,{useState} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
// core components
import axios from "axios";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Project from "components/Project/Project.js";
import NotificationsReadTable from 'components/NotificationsReadTable/NotificationsReadTable.js'
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllParents, getParentsPages } from 'reduxStore/ReduxAction/parentAction';
import { getParentData } from 'actionStore/FirebaseAction/notificationAction';
import { importChildRequest } from 'reduxStore/ReduxAction/childAction';
import { buttonGradient } from "assets/jss/material-dashboard-react.js";
import _ from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress';
import Loader from "react-js-loader";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import Block from '@material-ui/icons/Block';
import DatePicker from "react-datepicker";
import moment from 'moment';
import { getExistedParentsData } from 'actionStore/FirebaseAction/parentAction';

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

function NotificationReadList(props) {
    const { parentData, childData } = props;
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();

    const [fetchData, setFetchData] = useState([]);
    const [parentList, setParentList] = useState([]);
    const [isRead, setIsRead] = useState(true);
    const [isShowLoader, setShowLoader] = useState(false);

    useEffect(() => {
        (async () => {
            setShowLoader(true)
            getParentList()
            await props.getAllParents();
            setShowLoader(false)
        })();
    }, []);

    const getParentList = async () => {
        const parentData = await getExistedParentsData();
        setParentList(parentData)
    }

    useEffect(() => {

    }, [parentData])

    useEffect(() => {
        (async () => {
            const selectedData = location.state.selectedData;
            const { read_by } = selectedData;
            const parentData = await getParentById(read_by);
            setFetchData(parentData)
            // console.log(selectedData)
        })();
    }, []);

    const getParentById = (read_by) => {
        return new Promise((resolve) => {
            const arr = [];
            read_by.map(async (item, index) => {
                const parentData = await getParentData(item);
                arr.push(parentData);

                if (index == (read_by.length - 1)) {
                    resolve(arr)
                }
            })
        })
    }

    const getRecord = () => {
        if (isRead) {
            return fetchData
        } else {
            const data = _.uniqBy(parentList, 'id');
            const result = _.differenceBy(data, fetchData, 'parent_id');
            return result;
        }
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="primary">
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={9}>
                                <h4 className={classes.cardTitleWhite}>Notifications Read by Parents</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Notifications read status for Eos-danceschool
                                </p>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3} justify="center" container>
                                <Button color="buttonGradient" className={classes.themeButton} onClick={() => setIsRead(!isRead)} >{isRead ? `Notification Unread by Parents` : `Notification Read by Parents`}</Button>
                            </GridItem>
                        </GridContainer>
                    </CardHeader>
                    <CardBody>
                        <NotificationsReadTable
                            isRead={isRead}
                            showLoader={isShowLoader}
                            totalRow={getRecord().length}
                            tableData={getRecord()}
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
        parentData: state.parentReducer,
        notificationsData: state.notificationReducer
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getAllParents,
        getParentsPages,
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(NotificationReadList);