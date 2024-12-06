import PropTypes from 'prop-types'; // Import PropTypes
import { Link } from 'react-router-dom';

const BlogCards = ({ 
  blogImage = "https://placehold.jp/300x300.png", // Default image if not passed
  blogTitle, 
  blogShortDesc,
  blogCreatedAt, 
  blogCreatedBy,
  onEdit, 
  hrefLink,
  onDelete 
}) => {
  return (
    <div className="group cards-Container flex flex-col justify-center max-w-cardBlog m-auto bg-black mb-5 border border-white rounded p-5 backdrop-blur-sm bg-opacity-40">
      <div className="cards mb-5">
        <Link to={hrefLink}>
          <figure className='relative overflow-hidden'>
            <img src={blogImage} alt="" className="bgimg absolute  " style={{ background: `url(${blogImage})`, filter: 'blur(10px)', zIndex: "-1"}} />
            <img
              className="blogThumb max-h-cardBlog mx-auto z-10 relative"
              src={blogImage}
              alt="Blog Thumbnail"
            />
          </figure>
          <h2 className="blogTitle font-bold text-3xl uppercase mb-3">{blogTitle}</h2>
          <p className='italic mb-2'>{blogShortDesc}</p>
          <p className="group flex justify-between flex-wrap">
            <span className="createdAt w-60">{blogCreatedAt}</span>
            <span className="createdBy w-fit">{blogCreatedBy}</span>
          </p>
        </Link>

        {/* Conditionally render Edit and Delete buttons */}
        {(onEdit || onDelete) && (
          <div className="actions mt-3">
            {onEdit && (
              <button 
                onClick={onEdit}
                className="editBtn text-blue-500 hover:underline"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button 
                onClick={onDelete}
                className="deleteBtn text-red-500 hover:underline ml-3"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Prop validation
BlogCards.propTypes = {
  blogImage: PropTypes.string,         // Image should be a string (URL)
  blogTitle: PropTypes.string.isRequired,  // Title should be a required string
  blogCreatedAt: PropTypes.string.isRequired, // Created date should be a required string
  blogCreatedBy: PropTypes.string.isRequired, // Author name should be a required string
  blogShortDesc: PropTypes.string.isRequired, 
  onEdit: PropTypes.func,               // Optional edit function
  onDelete: PropTypes.func,       
  hrefLink: PropTypes.string.isRequired, // Link should be a required string
};

export default BlogCards;
