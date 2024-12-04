export const BlogInistialState = {
    file: null,
    imagePreview: null,
    title: '',
    shortDesc: '',
    content: '',
    errors: {
      title: '',
      shortDesc: '',
      content: '',
    }
  };
  
  export const BlogReducer = (state, action) => {
    switch (action.type) {
      case 'changeInputs':
        return {
          ...state,
          [action.payload.name]: action.payload.value,
        };
  
      case 'changeFile':
        return {
          ...state,
          file: action.payload.file,
          imagePreview: action.payload.preview,
        };
  
      case 'setError':
        return {
          ...state,
          errors: {
            ...state.errors,
            [action.payload.field]: action.payload.message,
          },
        };
  
      case 'reset':
        return {
          ...BlogInistialState
        };
  
      default:
        return state;
    }
  };