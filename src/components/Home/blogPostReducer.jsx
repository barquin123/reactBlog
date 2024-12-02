// Initial state for blogs
export const BlogPostInitialState = {
    blogs: [], // Stores the list of blogs
    error: null, // Error message in case of failure
    isLoading: false, // Loading state to indicate network request in progress
  };
  
  // Action Types
  export const DELETE_BLOG = 'DELETE_BLOG';
  export const UPDATE_BLOG = 'UPDATE_BLOG';
  export const SET_BLOGS = 'SET_BLOGS';
  export const SET_LOADING = 'SET_LOADING';
  export const SET_ERROR = 'SET_ERROR';
  
  // Reducer function for blogs
  export const BlogPostReducer = (state, action) => {
    switch (action.type) {
      case SET_BLOGS:
        return {
          ...state,
          blogs: action.payload, // Set blog list from action payload
          isLoading: false,
        };
      case DELETE_BLOG:
        return {
          ...state,
          blogs: state.blogs.filter(blog => blog.id !== action.payload), // Remove blog by id
        };
      case UPDATE_BLOG:
        return {
          ...state,
          blogs: state.blogs.map(blog =>
            blog.id === action.payload.id
              ? { ...blog, ...action.payload.updatedData } // Update specific blog data
              : blog
          ),
        };
      case SET_LOADING:
        return {
          ...state,
          isLoading: action.payload, // Update loading state
        };
      case SET_ERROR:
        return {
          ...state,
          error: action.payload, // Set error message
        };
      default:
        return state;
    }
  };
  