import React,{useState,useEffect,useRef} from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import axios from 'axios';
import { Button } from "@material-ui/core";
import { Redirect, Switch, Route, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { adddata,editdata } from 'reduxStore/Action/Action';
let ans;
/*import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {addstudent} from '../../Action/Action';
import { Button } from "@material-ui/core";
import { setCommentRange } from "typescript";*/
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));
const Add = (props) => {
  let { id } = useParams();
  //console.log(props.location.state.id);
  const[editdata,setEditData]=useState(null);
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [age, setAge] = useState("");
  const [ernum, setErnum] = useState(" ");
  const [image,setImage]=useState(null);
  const[editimage,setEditImage]=useState(false);
  const ref1=useRef('myfile')
  useEffect(() => {
    if(id!==undefined)
    {
    (async () => {
       ans = await   axios.get(`http://localhost:3001/student/${id}`)
        setFirstname(ans.data[0].firstname);
        setLastname(ans.data[0].lastname);
        setAge(ans.data[0].age);
        setErnum(ans.data[0].ernum)

    })();
  }
 }, []);

  
  const classes = useStyles();
  
  const [flag, setFlag] = useState(0);
  const onFirstanme = (e) => {
    console.log(e.target.value);
        setFirstname(e.target.value);
  }
  const onLastname = (e) => {
    console.log(e.target.value);
    setLastname(e.target.value);
  //  setLastname(e.target.value);
  }
  const onAge = (e) => {
    setAge(e.target.value);
  }
  const onErnum = (e) => {
    setErnum(e.target.value);
  }
  const onSubmit =async () => {
    console.log("hello",image);
    const data = new FormData();
    data.append('myFile',image);
   
   const data1=await axios.post("http://localhost:3001/student/addimage",data,{
    });
    console.log(await data1.data);
    const data2=await  axios
    .post("http://localhost:3001/add/student",{
      Firstname: Firstname,
      lastname: Lastname,
      age: age,
      ernum: ernum,
      //image:JSON.stringify(image);
    })
    await props.adddata(data2.data)
  
      
     /* axios('http://localhost:3001/uploadimage',{
        file:image
      }).then(res=>console.log(res.data));*/
    setFirstname(" ");
    setLastname(" ");
    setAge(" ");
    setErnum(" ");
    setFlag(1);
    //console.log("hello world");
    //props.adddata(res.data)
    //  props.adddata(ans.data);
  }
  const onEditing=async ()=>{
    console.log("image",image);
    if(editimage===true)
    {
      const data = new FormData();  
      data.append('myFile',image);
   
     const data1=await axios.post("http://localhost:3001/student/addimage",data,{
      });
      await  axios.put(`http://localhost:3001/deleteImage/${id}`).then(res=>console.log(res.data));
      await  axios.put(`http://localhost:3001/student/update/${id}`,{
            Firstname: Firstname,
            lastname: Lastname,
            age: age,
            ernum: ernum ,
            status:editimage    
       }).then(res=>props.editdata(res.data,id));
    }
    else
    {
        axios.put(`http://localhost:3001/student/update/${id}`,{
            Firstname: Firstname,
            lastname: Lastname,
            age: age,
            ernum: ernum ,
            status:editimage    
          }).then(res=>props.editdata(res.data,id));
    }
          setFlag(1);
  }
  const filesubmit=(e)=>{
      console.log(e.target.files[0]);  
      setImage(e.target.files[0]);
      setEditImage(true);
      
  }
  // //  props.addstudent(Firstname,'khakhkhar',21,23);
  // }
  // props.addstudent(Firstname,'khakhkhar',21,23);
  //}
  return (
    <div>
          <h3>{id===undefined ?<h3>Add Student</h3>:<h3>Edit Studnet</h3>}</h3>
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
            {
              <h3>Edit Profile</h3>
            }
           <input ref={ref1} type="file" name="myFile" onChange={filesubmit}  accept="image/*"/>
            <TextField value={ernum} type="number" onChange={onErnum} id="standard-basic" label="Er Num" />
            { id===undefined ?
            <Button onClick={onSubmit}>Add Student</Button>
            :<Button onClick={onEditing}>Update Student</Button>
            }
            {
              flag === 1 ?
                <Switch>
                  <Redirect from="/admin/add" to="/admin/table" />

                </Switch>
                : null
            }
          </form >
        </div>

  );
}
const mapStateToProps = state => {
  return {
    todo: state
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    adddata,editdata
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Add);
