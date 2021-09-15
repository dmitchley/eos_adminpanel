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
import DueinvoiceTable from 'components/DueinvoiceTable/DueinvoiceTable.js'
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllInvoice, getInvoicePages, editDueRequest } from 'reduxStore/ReduxAction/dueInvoiceAction';
import { buttonGradient } from "assets/jss/material-dashboard-react.js";
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
    const { invoiceData } = props;
    const classes = useStyles();
    const history = useHistory();
    const inputFile = useRef(null)
    const [fetchData, setFetchData] = useState([]);
    useEffect(() => {
        (async () => {
            await props.getAllInvoice();
        })();
    }, []);

    const getRecord = () => {
        return _.uniqBy(invoiceData.dueInvoiceData, 'id');
    }

    const onNextPage = () => {
        try {
            const { dueInvoiceData } = invoiceData;
            props.getInvoicePages(dueInvoiceData[dueInvoiceData.length - 1])
        } catch (error) {
            console.log(error)
        }
    }

    const onAddInvoice = () => {
        history.push("/admin/addDueinvoice");
    }

    const onTogglePaid = (value) => {
        const { due_invoices_id, is_paid } = value;
        const data = {
            is_paid: !is_paid
        }
        props.editDueRequest(due_invoices_id, data)
    }

    const onToggleVerify = (value) => {
        const { due_invoices_id, is_verify } = value;
        const data = {
            is_verify: !is_verify
        }
        console.clear();
        console.log('---- onToggleVerify ----');
        console.log(is_verify)
        console.log(data)
        props.editDueRequest(due_invoices_id, data)
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="primary">
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={9}>
                                <h4 className={classes.cardTitleWhite}>Due Invoice List</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Due Invoice of Eos-danceschool
                                </p>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3} justify="center" container>
                                <Button color="buttonGradient" className={classes.themeButton} onClick={() => onAddInvoice()}>Add Due Invoice</Button>
                            </GridItem>
                        </GridContainer>
                    </CardHeader>
                    <CardBody>
                        <DueinvoiceTable
                            tableData={getRecord()}
                            showLoader={invoiceData.showDueInvoiceLoader}
                            onNextPage={() => onNextPage()}
                            onTogglePaid={(value) => onTogglePaid(value)}
                            onToggleVerify={(value) => onToggleVerify(value)}
                        />
                    </CardBody>
                </Card>
            </GridItem>

        </GridContainer>
    );
}

const mapStateToProps = state => {
    return {
        invoiceData: state.dueInvoiceReducer
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getAllInvoice,
        getInvoicePages,
        editDueRequest
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Children);