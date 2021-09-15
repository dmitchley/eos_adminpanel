import React,{useState,useEffect} from "react";
//import React,{useState} from "react";
// @material-ui/core components
import Button from '@material-ui/core/Button';
import {Redirect,Switch,Route}from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// core components
import Add from '../Add/add'
import axios from "axios";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import {displaystudent} from 'reduxStore/Action/Action';
let ans=[];
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
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

function TableList(props) {
  const classes = useStyles();
  const [fatchdata, setFetchdata] = useState([]);
  const [data,setData]=useState([]);
  // eslint-disable-next-line no-unused-vars
  const [flag, setFlag] = useState(0);
  const flagvalue = (e) => {
    e.preventDefault();
    setFlag(1);
  }
  useEffect(() => {
  /*  (async () => {
       ans = await axios("http://localhost:3001/student");

   // console.log(ans.data);
      setFetchdata(ans.data);
   //  props.displaystudent(ans.data);
    })();
*/
 }, []);
 console.log("hello doll");
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        {flag === 1 ? (
          <Switch>
            <Redirect from="/admin/table" to="/admin/add" />
            <Route path="/add" exact>
            </Route>
            </Switch>
        ) :null
        }
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Student List</h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
            <Button style={{borderRadius:"10px",borderColor:"black"}} onClick={flagvalue}>Add Student</Button>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="buttonGradient"
              tableHead={["FirstName", "Lastname","Profile", "age", "er num","Edit","Delete"]}
             // tableData={props.data}
              status='student'
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
const mapStateToProps = state => {
  console.log("this is state",state);
  return {
      data :state
  };
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
      displaystudent
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(TableList);