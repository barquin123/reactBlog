export const BlogInistialState = {
    file: 'null',
    title: '',
    shortDesc: '',
    content: '',
};
export const BlogReducer = (state, action) => {
    switch (action.type) {
        case 'changeInputs':
            return { ...state, 
                [action.payload.name]: action.payload.value, 
            };
        case 'changeFile':
            return { 
                ...state,
                image: action.payload, 
            } ;

        case 'reset':
            return {BlogInistialState};
        default:
            return state;
    };
};