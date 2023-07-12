import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { baseUrl } from "utils/constants";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch(`${baseUrl}posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    console.log("prrrr",data)
    dispatch(setPosts({ posts: data.posts }));
  };

  const getUserPosts = async () => {
    const response = await fetch(`${baseUrl}posts/${userId}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    console.log("postsmm",data)
    dispatch(setPosts({ posts: data }));
  };

  const deletePost = (postId) => {
    const updatedPosts = posts.filter((post) => post.postId !== postId);
    dispatch(setPosts({ posts: updatedPosts }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
      console.log('posos ',posts  )
    } else {
      getPosts();
    }
  }, []);
  console.log('eeposos ',posts  )



  return (
    <>
      {
      Array.isArray(posts) &&
      posts?.map(({  _id,  userId,  firstName,  lastName,  description,  location,  picturePath,  userPicturePath,  likes,  comments,  reports,}) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            reports={reports}
            deletePost={deletePost}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;