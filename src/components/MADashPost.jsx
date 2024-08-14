import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Table, Modal, Alert, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function MADashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [postId, setPostid] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErr, setShowErr] = useState(null);

  const getPosts = () => {
    setLoading(true);
    axios
      .get("https://rehman-blog-backend.vercel.app/api/post/getPosts")
      .then((res) => {
        console.log(res);
        if (res?.data?.isSuccessfull) {
          setUserPosts([...res?.data?.data?.posts]);
          if (res?.data?.data?.posts.length < 9) {
            setShowMore(false);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setShowErr(err.message);
      });
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleShowMore = () => {
    const startIndex = userPosts.length;
    axios
      .get(
        `https://rehman-blog-backend.vercel.app/api/post/getPosts?userId=${
          currentUser.data?.user?._id || currentUser._id
        }&startIndex=${startIndex}`
      )
      .then((res) => {
        if (res?.data?.isSuccessfull) {
          setUserPosts([...userPosts, ...res?.data?.data?.posts]);
          if (res?.data?.data?.posts.length < 9) {
            setShowMore(false);
          }
        }
      })
      .catch((err) => {
        setShowErr(err.message);
      });
  };

  const handleDeletePost = () => {
    setShowModal(false);
    axios
      .delete(`https://rehman-blog-backend.vercel.app/api/post/deletePost/${postId}`)
      .then((res) => {
        if (res?.data?.isSuccessfull) {
          setUserPosts((prev) => prev.filter((user) => user._id !== postId));
        }
      })
      .catch((err) => {
        setShowErr(err.message);
      });
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
          {(currentUser.data?.user?.isAdmin || currentUser.isAdmin) &&
          userPosts.length > 0 ? (
            <>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>Date Updated</Table.HeadCell>
                  <Table.HeadCell>Post Image</Table.HeadCell>
                  <Table.HeadCell>Post Title</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>
                    <span>Edit</span>
                  </Table.HeadCell>
                </Table.Head>
                {userPosts.map((x) => {
                  return (
                    <Table.Body key={x._id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>
                          {new Date(x.updatedAt).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>
                          <Link to={`/post/${x.slug}`}>
                            <img
                              src={x.image}
                              alt={x.title}
                              className="w-20 h-10 object-cover bg-gray-500"
                            />
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          <Link
                            className="font-semibold text-gray-900 dark:text-white"
                            to={`/post/${x.slug}`}
                          >
                            {x.title}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>{x.category}</Table.Cell>
                        <Table.Cell>
                          <span
                            onClick={() => {
                              setShowModal(true);
                              setPostid(x._id);
                            }}
                            className="font-medium text-red-500 hover:underline cursor-pointer"
                          >
                            Delete
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <Link to={`/update-post/${x._id}`}>
                            <span className="font-medium text-blue-500 hover:underline cursor-pointer">
                              Edit
                            </span>
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  );
                })}
              </Table>
              {showMore && (
                <button
                  onClick={handleShowMore}
                  className="w-full py-5 text-blue-500  text-sm"
                >
                  Show More
                </button>
              )}
              <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size="md"
              >
                <Modal.Header />
                <Modal.Body>
                  <div className="text-center">
                    <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mx-auto" />
                    <h3 className="mb-5 text-lg  text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this post?
                    </h3>
                    <div className="flex justify-between">
                      <Button color="failure" onClick={handleDeletePost}>
                        Yes, I am sure
                      </Button>
                      <Button color="gray" onClick={() => setShowModal(false)}>
                        No, Cancel
                      </Button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </>
          ) : (
            <p>You Have No Post Yet</p>
          )}
          {showErr && <Alert color="failure">{showErr}</Alert>}
        </div>
      )}
    </>
  );
}
