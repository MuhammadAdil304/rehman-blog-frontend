import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MAPostCard from "../components/MAPostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [showErr, setShowErr] = useState(null);

  const getPosts = () => {
    axios
      .get("https://rehman-blog-backend.vercel.app/api/post/getPosts")
      .then((res) => {
        if (res.data?.isSuccessfull) {
          setPosts([...res.data?.data?.posts]);
        } else {
          setShowErr(res.data?.error);
        }
      })
      .catch((err) => {
        setShowErr(err.message);
      });
  };

  useEffect(() => {
    getPosts();
  });
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-500 dark:text-gray-300 text-xs md:text-sm">
          Explore a realm of insights and guidance covering the realms of web
          craftsmanship, software architecture, and the language of programming,
          meticulously curated just for you.
        </p>
        <Link
          to="/search"
          className="text-sm text-blue-500 font-bold hover:underline"
        >
          View All Post
        </Link>
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-center mb-5">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {posts.map((x) => {
                return <MAPostCard key={x._id} post={x} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
