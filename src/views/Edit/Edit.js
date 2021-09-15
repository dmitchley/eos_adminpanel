import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import axios from 'axios';
import { Button } from "@material-ui/core";
/*import {Redirect,Switch,Route} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {adddata} from '../../Action/Action';*/

let  ans;
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
        },
    },
}));
const EditStudent = (props) => {
  const classes = useStyles();
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [age, setAge] = useState(0);
  const [ernum, setErnum] = useState(" ");
  const [flag, setFlag] = useState(0);
  const onFirstanme = (e) => {
    setFirstname(e.target.value);
    console.log(e.target.value);
    }
  const onLastname = (e) => {
    setLastname(e.target.value);
    }
    const onAge=(e)=>{
        setAge(e.target.value);
    }
    const onErnum=(e)=>{
        setErnum(e.target.value);
    }
  const onSubmit = (e) => {
        //setFirstname(e.target.value);
    axios
      .post("http://localhost:3001/student/add", {
        Firstname: Firstname,
        lastname: Lastname,
            "age":age,
            "ernum":ernum
        }).then(res=>props.adddata(res.data))
        setFirstname(" ");
        setLastname(" ");
        setAge(" ");
        setErnum(" ");
        setFlag(1);
    console.log("hello world");
       // props.adddata(ans.data);
    //  props.addstudent(Firstname,'khakhkhar',21,23);
    }
  // props.addstudent(Firstname,'khakhkhar',21,23);
//}
    return (
        <div>
            <h3>Add Student</h3>
            <form className={classes.root} noValidate autoComplete="off">
            <TextField
            value={Firstname}
            onChange={onFirstanme}
            id="standard-basic"
            label="Firstname"
            />
        <br></br>
            <TextField
            value={Lastname}
            onChange={onLastname}
            id="standard-basic"
            label="Lastname"
            />
        <TextField
          onChange={onAge}
          type="number" 
          id="standard-basic"
          label="Age"
        value={age}
          />
        <TextField value={ernum} type="number" onChange={onErnum} id="standard-basic" label="Er Num" />
        <Button onClick={onSubmit}>Add Student</Button>
      </form >
    </div>
  );
}

export default EditStudent;
