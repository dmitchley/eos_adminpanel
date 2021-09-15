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
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllParents, getParentsPages, importParentRequest } from 'reduxStore/ReduxAction/parentAction';
import { requestDisplayParentClose } from 'reduxStore/Action/parentAction';
import { importChildRequest } from 'reduxStore/ReduxAction/childAction';
import { getExistedParentsData } from 'actionStore/FirebaseAction/parentAction';
import { getExistedChildData } from 'actionStore/FirebaseAction/childAction';
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

function Parents(props) {
    const { parentData, childData } = props;
    const classes = useStyles();
    const history = useHistory();
    const inputFile = useRef(null)
    const [fetchData, setFetchData] = useState([]);
    useEffect(() => {
        (async () => {
            await props.getAllParents();
        })();
    }, []);

    // useEffect(() => {
    //     const result = _.uniqBy(props.parentData.parentData, 'id');
    //     setFetchData(result);
    // }, [props.parentData.isGetInitialData == true])

    const onAddParent = () => {
        history.push("/admin/addParent");
    }

    const getRecord = () => {
        // const newData = _.uniqBy(props.parentData.parentData, 'id');
        // return [...newData, ...newData]
        return _.uniqBy(props.parentData.parentData, 'id');
    }

    const onNextPage = () => {
        try {
            const { parentData } = props.parentData;
            const lastId = parentData;
            props.getParentsPages(parentData[parentData.length - 1])
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

        // const firest10 = _.take(list, 40)
        // console.log(firest10)
        onRequestImport(list)
    }

    const validateParentRecord = (dataArray) => {
        return new Promise(async (resolve, reject) => {
            const existedParentData = await getExistedParentsData();
            const mapDataArray = dataArray.map((item) => {
                return { ...item, email: item[`Customer Email`] }
            })
            let diffBy = _.differenceBy(mapDataArray, existedParentData, 'email');
            resolve(diffBy)
        })
    }

    const validateChildRecord = (dataArray) => {
        return new Promise(async (resolve, reject) => {
            const existedChildData = await getExistedChildData();
            const mapDataArray = dataArray.map((item) => {
                return { ...item, gender: item[`Gender`], fname: item[`First Name`] }
            })
            var result = _.differenceWith(mapDataArray, existedChildData, function (arrValue, othValue) {
                return (arrValue.fname === othValue.fname && arrValue.gender === othValue.gender);
            });
            resolve(result)
        })
    }

    const onRequestImport = async (dataArray) => {
        const sampleObj = dataArray[0];
        const requiredKeys = ['Customer Email', 'Customer First Name', 'Customer Last Name', 'Customer Type(s)', 'Customer Home Phone',
            'Customer Work Phone', 'Customer Mobile Phone 1', 'Customer Mobile Phone 2', 'Customer Fax', 'Address #1', 'Suburb', 'State', 'Postcode']

        const isCsvValid = _.every(requiredKeys, _.partial(_.has, sampleObj));
        if(isCsvValid) {
            const validParentData = await validateParentRecord(dataArray);
            const validChildData = await validateChildRecord(dataArray);
    
            if (validParentData.length > 0) {
                const isImportParent = await props.importParentRequest(validParentData);
                if (isImportParent) {
                    props.getAllParents()
                    props.importChildRequest(validChildData);
                }
            } else {
                props.requestDisplayParentClose()
                if(validChildData.length>0)
                {
                    props.importChildRequest(validChildData);
                }
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

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="primary">
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={8}>
                                <h4 className={classes.cardTitleWhite}>Parents List</h4>
                                <p className={classes.cardCategoryWhite}>
                                    List of parents who trust Eos-danceschool
                                </p>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={2} justify="center" container>
                                {(parentData.isImportData || childData.isImportChildData)
                                    ?
                                    <Button color="buttonGradient" className={classes.importButton}>
                                        <Loader type="spinner-default" bgColor={"#FFFFFF"} size={20} />
                                    </Button>
                                    :
                                    <Button color="buttonGradient" className={classes.importButton} onClick={() => onImportFile()}>Import Parents</Button>
                                }
                            </GridItem>
                            <input type='file' accept=".csv,.xlsx,.xls" id='file' ref={inputFile} onChange={(event) => onFileChange(event)} style={{ display: 'none' }} />
                            <GridItem xs={12} sm={12} md={2} justify="center" container>
                                <Button color="buttonGradient" className={classes.themeButton} onClick={() => onAddParent()}>Add Parents</Button>
                            </GridItem>
                        </GridContainer>
                    </CardHeader>
                    <CardBody>
                        {/* <Project
                            tableHeaderColor="buttonGradient"
                            // tableHead={["ProjectName", "Language", "database"]}
                            tableHead={["Name", "Email", "Primary Mobile", "Address"]}
                            // tableData={fatchdata}
                            tableData={getRecord()}
                            onNextPage={() => onNextPage()}
                            // tableData={[
                            //     ["Dakota Rice", "Niger", "Oud-Turnhout", "$36,738"],
                            //     ["Minerva Hooper", "Curaçao", "Sinaai-Waas", "$23,789"],
                            //     ["Sage Rodriguez", "Netherlands", "Baileux", "$56,142"],
                            //     ["Philip Chaney", "Korea, South", "Overland Park", "$38,735"],
                            //     ["Doris Greene", "Malawi", "Feldkirchen in Kärnten", "$63,542"],
                            //     ["Mason Porter", "Chile", "Gloucester", "$78,615"],
                            // ]}
                            status="project"
                        /> */}
                        <ParentTable
                            tableHead={["Name", "Email", "Primary Mobile", "Address"]}
                            tableData={getRecord()}
                            showLoader={parentData.showParentLoader}
                            onNextPage={() => onNextPage()}
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
        parentData: state.parentReducer,
        childData: state.childrenReducer
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getAllParents,
        getParentsPages,
        importParentRequest,
        importChildRequest,
        requestDisplayParentClose
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Parents);