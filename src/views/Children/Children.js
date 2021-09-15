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
import ParentTable from 'components/ParentTable/ParentTable.js'
import ChildTable from 'components/ChildTable/ChildTable.js'
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllChildren, getChildrenPages, deleteChildrenRequest } from 'reduxStore/ReduxAction/childAction';
import { buttonGradient } from "assets/jss/material-dashboard-react.js";
import _ from 'lodash';
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

function Children(props) {
    const { parentData, childData } = props;
    const classes = useStyles();
    const history = useHistory();
    const inputFile = useRef(null)
    const [fetchData, setFetchData] = useState([]);
    const [isOpenAlert, setIsopenAlert] = useState(false);
    const [deleteChildId, setDeleteChildId] = useState('');

    useEffect(() => {
        (async () => {
            await props.getAllChildren();
        })();
    }, []);

    const getRecord = () => {
        return _.uniqBy(props.childData.childrenData, 'id');
    }

    const onNextPage = () => {
        try {
            const { childrenData } = props.childData;
            props.getChildrenPages(childrenData[childrenData.length - 1])
        } catch (error) {
            console.log(error)
        }
    }

    const onEditChild = (selectedChild) => {
        // history.push("/admin/addChild");
        history.push({
            pathname: '/admin/addChild',
            state: { selectedChild: selectedChild }
        });
    }

    const onDeleteChild = (selectedChild) => {
        const { children_id } = selectedChild;
        setDeleteChildId(children_id)
        setIsopenAlert(true)
    }

    const onAlertOk = async () => {
        console.clear();
        console.log('----- onAlertOk ------');
        console.log(deleteChildId)
        await props.deleteChildrenRequest(deleteChildId);
        setIsopenAlert(false)
        setDeleteChildId('')
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="primary">
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <h4 className={classes.cardTitleWhite}>Children List</h4>
                                <p className={classes.cardCategoryWhite}>
                                    List of Children who join Eos-danceschool
                                </p>
                            </GridItem>
                        </GridContainer>
                    </CardHeader>
                    <AlertOption 
                        isOpen={isOpenAlert}
                        alertTitle={'Are you sure you want to delete this child?'}
                        alertDescription={''}
                        okLabel={'Yes'}
                        closeLabel={'No'}
                        handleClose={() => setIsopenAlert(false)}
                        handleClickOpen={() => onAlertOk()}
                    />
                    <CardBody>
                        {console.log('*------ childData.showChildLoader')}
                        {console.log(childData.showChildLoader)}
                        <ChildTable
                            tableHead={["Childname", "Parentname", "Age", "Startdate"]}
                            tableData={getRecord()}
                            showLoader={childData.showChildLoader}
                            onNextPage={() => onNextPage()}
                            onEditChild={(selectedChild) => onEditChild(selectedChild)}
                            onDeleteChild={(selectedChild) => onDeleteChild(selectedChild)}
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
        childData: state.childrenReducer
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getAllChildren,
        getChildrenPages,
        deleteChildrenRequest
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Children);