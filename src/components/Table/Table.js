import React,{useState,useEffect} from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Avatar from '@material-ui/core/Avatar';

// core components
import {Pagination} from '@material-ui/lab';
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import { Button } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators, } from 'redux';
import { deletedata,displaystudent,pagenumber } from "reduxStore/Action/Action";
import  {Route,Redirect,Switch} from 'react-router-dom';
//import shubham from '../../../../Leocan/studentApi/uploads'
import Add from '../../views/Add/add'
const useStyles = makeStyles(styles);
var ans1;
var path="../../../../Leocan/studentApi/uploads/"

function CustomTable(props) {
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor, status } = props;
  const [data,setData]=useState([]);
  const [editId,setEditId]=useState(null);
  const [page, setPage] =useState(1);
  const[count,setCount]=useState(0);
  const handleChange = (event, value) => {
    setPage(value);
    props.pagenumber(value);
  };

  const [editdisplay,setEditDisplay]=useState(null);
  const deleteStudent=(id)=>{
    console.log(id);
    axios
      .delete(`http://localhost:3001/student/delete/${id}`)
      .then((res) => alert(res.data))
      .catch((res) => console.log(res));
      props.deletedata(id);
     // console.log(props.todo.StudentReducer[0]);
     setData(props.todo.StudentReducer[0]);
     // setData(props.todo[0]);s
    }
//console.log(props.todo[0]);
  const editStudent = (id) => {
   setEditId(id);
   console.log(id);
    setEditDisplay(1);
   /* axios
      .get(`http://localhost:3001/student/${id}`)
      .then((re) => setEditdata(re.data[0]));

      
    // const  ans=await axios.get(`http://localhost:3001/student/${id}`);
    if(edidata!==null)
    { 
      setEditDisplay(1);
    }*/
    }
    useEffect(()=>{
      console.log("hello");
      setPage(props.todo.PageReducer.page);
      (async () => {
      const  ans = await axios.get(`http://localhost:3001/studentCount`);
       const ans1= await axios.get(`http://localhost:3001/paginationStudent`,{
        params: {
          page:page 
        }
         });
         console.log(ans1.data);
        setData(ans1.data);
        props.displaystudent(ans1.data);
        setPage(props.todo.PageReducer.page)
          console.log("this data",data);
          console.log("this is data",ans1.data);
      if(ans.data[0].count%5===0){
          setCount(ans.data[0].count/5);
      }
      else
      {
        setCount(((ans.data[0].count-ans.data[0].count%5)/5)+1);
      }
      })();
    },[page]);
    console.log(count);
    console.log(props.todo.StudentReducer[0]);
    console.log(status);
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
      {   editdisplay===1?
        <Switch>
          <Redirect  from="/admin/table" to={`/admin/add/${editId}`} />
        </Switch>
        :null}
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}   
                   >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {
           status ==='student' && data.length>0 ?
         data.map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                <TableCell className={classes.tableCell} key={key}>
                      {prop.firstname}
                    </TableCell>
                    <TableCell className={classes.tableCell} key={key}>
                      {prop.lastname}
                    </TableCell>
                    <TableCell className={classes.tableCell} key={key}>
                         <Avatar alt={prop.firstname} className={classes.large}  src={`http://localhost:3001/uploads/${prop.image}`} />
                    </TableCell>
                    <TableCell className={classes.tableCell} key={key}>
                      {prop.age}
                    </TableCell>
                    <TableCell className={classes.tableCell} key={key}>
                      {prop.ernum}
                    </TableCell>
                    <TableCell className={classes.tableCell} key={key}>
                        <Button onClick={()=>editStudent(prop.user_id)} style={{marginLeft:"-22px"}}><EditIcon /></Button>           
                    </TableCell>
                    <TableCell className={classes.tableCell} key={key}>
                    <Button onClick={()=>deleteStudent(prop.user_id)} style={{marginLeft:"-15px"}}><DeleteIcon /></Button>
                    </TableCell>
                         
                   
              </TableRow>
            );    
          }) 
        :
       /* tableData.length>0 ?
        tableData.map((prop, key) => {
         return (
           <TableRow key={key} className={classes.tableBodyRow}>
             <TableCell className={classes.tableCell} key={key}>
                      {prop.name}
                 </TableCell>
                 <TableCell className={classes.tableCell} key={key}>
                   {prop.language}
                 </TableCell>
                 <TableCell className={classes.tableCell} key={key}>
                      {prop.database}
                 </TableCell>
           </TableRow>
          
         );
       })*/
       null
      }
      { status==='student' ?
      <Pagination count={count} page={page} onChange={handleChange} />
      :null
    }
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
const mapStateToProps = state => {
  console.log(state);
  return {
      todo: state
};
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
     deletedata,
     displaystudent,
     pagenumber
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomTable)