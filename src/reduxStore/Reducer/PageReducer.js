import React from 'react'
import {PAGE_MANAGE } from '../Action/ActionTypes';
const INITIAL_STATE = {
    page:1
};
const PageReducer=(state = INITIAL_STATE, action)=>{
    console.log("satte",state);
    switch (action.type) {
        case PAGE_MANAGE:
            state.page=action.page;
                return state;
        default:
             return state;
    }
}

export default PageReducer
