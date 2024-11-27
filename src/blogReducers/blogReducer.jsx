export const initialState = {
    blogs: [],
}

export const blogReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'Display_Blogs':
            return {
                ...state,
                blogs: action.payload
            }
        case 'Add_Blog':
            return {
                ...state,
                blogs: [...state.blogs, action.payload]
            }

        case 'Update_Blog':
            return{
                ...state,
                blogs: state.blogs.map((blog) => blog.id === action.payload.id ? action.payload : blog)
            }
        case 'Delete_Blog':
            return{
                ...state,
                blogs: state.blogs.filter((blog) => blog.id !== action.payload)
            }
        default:
            return state;
    }
};