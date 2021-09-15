import { DISPLAY_STUDENT, ADD_STUDENT, DELETE_STUDENT, EDIT_STUDENT } from '../Action/ActionTypes';
const INITIAL_STATE = [];
const StudentReducer = (state = INITIAL_STATE, action) => {
  console.log("shubham ", action.data);
  switch (action.type) {
    case DISPLAY_STUDENT:
      let d=[];
      console.log("reduce the data",action.data);
      d=action.data;
      state[0]=d;
      console.log("state is ",state);
      return state;
    case ADD_STUDENT:
      let a = [];
      a = state[0];
      a.push(action.data);
      return state;
    case DELETE_STUDENT:
      console.log("id is", action.data);
      let b = [];
      b = state[0].filter((id) => id.user_id !== action.data);
      console.log("this is b ", b);
      state[0] = b;
      return state;
    case EDIT_STUDENT:
      let c=[];
     state[0].forEach(element => {
            if(element.user_id===action.data.user_id)
            {
              console.log("its matched");
                element.firstname=action.data.firstname;
                element.lastname=action.data.lastname;
                element.age=action.data.age;
                element.ernum=action.data.ernum
            }
      });
      console.log("edited",state[0]);
      return state;

    default:
      return state;
  }
}
export default StudentReducer;