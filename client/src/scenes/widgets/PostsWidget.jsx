import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import InfiniteScroll from "react-infinite-scroll-component";
import { baseUrl } from "utils/constants";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);

  const token = useSelector((state) => state.token);
  const [noMore, setnoMore] = useState(true);
  const [page, setpage] = useState(1);
  const getPosts = async () => {
    const response = await fetch(`${baseUrl}posts?_page=1&_limit=5`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data.posts }));
  };

  const getUserPosts = async () => {
    const response = await fetch(`${baseUrl}posts/${userId}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const deletePost = (postId) => {
    const updatedPosts = posts.filter((post) => post.postId !== postId);
    dispatch(setPosts({ posts: updatedPosts }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      if (!posts.length > 0) {
        fetchData();
      }
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${baseUrl}posts?_page=${page}&_limit=5`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error fetching posts:", error);
      return null;
    }
  };

  const fetchData = async () => {
    const postsFormServer = await fetchPosts();
    if (!postsFormServer.posts) {
      setnoMore(true);
      return;
    }
    dispatch(setPosts({ posts: [...posts, ...postsFormServer.posts] }));
    if (
      postsFormServer.posts.length === 0 ||
      postsFormServer.posts.length < 5
    ) {
      setnoMore(false);
    }
    setpage(page + 1);
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchData}
      hasMore={noMore}
      loader={<h4>Loading...</h4>}
      endMessage={<p>No more posts to load.</p>}
    >
      {Array.isArray(posts) &&
        posts?.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            comments,
            reports,
          }) => (
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
    </InfiniteScroll>
  );
};

export default PostsWidget;
