import { INCREMENT,DECREMENT } from "./actions";

const initialState = {
    count : 0
}

export default function counterReducer (state = initialState,action){
    switch(action.type){
        case INCREMENT:
            return {...state,count :state.count + 1}
    }
}



