import PropTypes from 'prop-types'; // Import PropTypes

// Set default values directly in function parameters
const BlogCards = ({ 
  blogImage = "https://placehold.jp/300x300.png", // Default image if not passed
  blogTitle, 
  blogCreatedAt, 
  blogCreatedBy 
}) => {
  return (
    <div className="group cards-Container flex flex-col justify-center w-fit m-auto">
      <div className="cards">
        <img
          className="blogThumb"
          src={blogImage}
          alt="Blog Thumbnail"
        />
        <h2 className="blogTitle font-bold text-6xl uppercase">{blogTitle}</h2>
        <p className="group flex flex-col">
          <span className="createdAt">{blogCreatedAt}</span>
          <span className="createdBy">{blogCreatedBy}</span>
        </p>
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
};

export default BlogCards;
