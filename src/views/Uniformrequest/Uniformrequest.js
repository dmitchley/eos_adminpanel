import React, { useState, useEffect } from "react";
//import React,{useState} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
// core components
import axios from "axios";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Project from "components/Project/Project.js";
import UniformReqTable from 'components/UniformReqTable/UniformReqTable.js'
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getInitialRequest, getRequestPages } from 'reduxStore/ReduxAction/uniformRequestAction';
import { setNotiCountListener } from 'reduxStore/ReduxAction/notificationAction';
import { uniformNotiListener } from 'reduxStore/ReduxAction/uniformRequestAction';
import { setReadStatusForUniformNoti } from 'actionStore/FirebaseAction/uniformRequestAction';

import _ from 'lodash';

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

};

const useStyles = makeStyles(styles);

function Parents(props) {
    const { uniformReqData, uniformNotiCount } = props;
    const classes = useStyles();
    const history = useHistory();
    const [fetchData, setFetchData] = useState([]);
    useEffect(() => {
        (async () => {
            await props.getInitialRequest();
            uniformNotiCountHandler()
        })();
    }, []);

    const uniformNotiCountHandler = async () => {
        const isStatusUpdate = await setReadStatusForUniformNoti();
        if(isStatusUpdate) {
            props.setNotiCountListener(-uniformNotiCount);
            props.uniformNotiListener(-uniformNotiCount);
        }
    }

    const onAddParent = () => {
        history.push("/admin/addParent");
    }

    const getRecord = () => {
        return _.uniqBy(props.uniformReqData.requestData, 'id');
    }

    const onNextPage = () => {
        try {
            const { requestData } = props.uniformReqData;
            const lastId = requestData;
            props.getRequestPages(requestData[requestData.length - 1])
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="primary">
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <h4 className={classes.cardTitleWhite}>Uniform Request</h4>
                                <p className={classes.cardCategoryWhite}>
                                    List of parents who requested uniform
                                </p>
                            </GridItem>
                            {/* <GridItem xs={12} sm={12} md={3} justify="center" container>
                                <Button color="buttonGradient" className={classes.themeButton} onClick={() => onAddParent()}>Add Parents</Button>
                            </GridItem> */}
                        </GridContainer>
                    </CardHeader>
                    <CardBody>
                        <UniformReqTable
                            tableHead={["userName", "Age", "Size"]}
                            tableData={getRecord()}
                            showLoader={uniformReqData.showUniformLoader}
                            onNextPage={() => onNextPage()}
                        />
                    </CardBody>
                </Card>
            </GridItem>

        </GridContainer>
    );
}

const mapStateToProps = state => {
    return {
        uniformReqData: state.uniformReducer,
        totalNotiCount: state.notificationReducer.totalNotificationCount,
        uniformNotiCount: state.uniformReducer.uniformNotiCount,
        reqCatchNotiCount: state.requestCatchupReducer.reqCatchNotiCount,
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getInitialRequest,
        getRequestPages,
        setNotiCountListener,
        uniformNotiListener,
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Parents);