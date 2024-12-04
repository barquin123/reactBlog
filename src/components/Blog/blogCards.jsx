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
    <div className="group cards-Container flex flex-col justify-center w-fit m-auto">
      <div className="cards mb-5">
        <Link to={hrefLink}>
          <img
            className="blogThumb"
            src={blogImage}
            alt="Blog Thumbnail"
          />
          <h2 className="blogTitle font-bold text-6xl uppercase">{blogTitle}</h2>
          <p>{blogShortDesc}</p>
          <p className="group flex justify-between">
            <span className="createdAt">{blogCreatedAt}</span>
            <span className="createdBy">{blogCreatedBy}</span>
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
