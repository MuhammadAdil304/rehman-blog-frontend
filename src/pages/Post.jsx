import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import axios from "axios";
export default function Post() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://rehman-blog-backend.vercel.app/api/post/getPosts?slug=${postSlug}`)
      .then((res) => {
        if (res.data?.isSuccessfull) {
          setPost(res.data?.data?.posts[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setShowErr(true);
        setLoading(false);
      });
  }, [postSlug]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center h-screen items-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
          <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto">
            {post && post.title}
          </h1>
          <Link
            to={`/search?category=${post && post.category}`}
            className="mt-5 self-center"
          >
            <Button color="gray" pill size="xs">
              {post && post.category}
            </Button>
          </Link>
          <img
            src={post && post.image}
            alt={post && post.title}
            className="mt-10 p-3 max-h-[600px] w-full object-cover"
          />
          <div className="flex justify-center p-3 border-b border-slate-500 mx-auto w-full text-xs max-w-2xl">
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div
            className="p-3 max-w-2xl mx-auto w-full post-content"
            dangerouslySetInnerHTML={{ __html: post && post.content }}
          ></div>
        </div>
      )}
    </>
  );
}
