import { DISPLAY_STUDENT,PAGE_MANAGE, ADD_STUDENT, DELETE_STUDENT ,EDIT_STUDENT} from "./ActionTypes";
export const displaystudent = (data) => {
//     console.log("hello bro",data);
  return {
    type: DISPLAY_STUDENT,
    data: data,
  };
};
export const adddata = (data) => {
  return {
    type: ADD_STUDENT,
    data: data,
    }
  };
export const editdata=(data,id)=>{
  return{
      type:EDIT_STUDENT,
      id:id,
      data:data
  }
}
export const deletedata = (id) => {
   console.log("1",id);
  return {
    type: DELETE_STUDENT,
    data: id,
  };
}
export const pagenumber=(page)=>{
  return {
    type:PAGE_MANAGE,
    page:page
  }
}
  

