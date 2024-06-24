import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function MADashboard() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [showErr, setShowErr] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  const getUsers = () => {
    axios
      .get("http://localhost:3000/api/user/getUsers?limit=5")
      .then((res) => {
        if (res.data?.isSuccessfull) {
          setUsers([...res.data?.data?.usersWithoutPassword]);
          setTotalUsers(res.data?.data?.totalUsers);
          setLastMonthUsers(res.data?.data?.lastMonthUsers);
        } else {
          setShowErr(res.data?.error);
        }
      })
      .catch((err) => {
        setShowErr(err.message);
      });
  };
  const getPosts = () => {
    axios
      .get("http://localhost:3000/api/post/getPosts?limit=5")
      .then((res) => {
        if (res.data?.isSuccessfull) {
          setPosts([...res.data?.data?.posts]);
          setTotalPosts(res.data?.data?.totalPosts);
          setLastMonthPosts(res.data?.data?.lastMonthPosts);
        } else {
          setShowErr(res.data?.error);
        }
      })
      .catch((err) => {
        setShowErr(err.message);
      });
  };
  useEffect(() => {
    if (currentUser.data?.user?.isAdmin || currentUser.isAdmin) {
      getUsers();
      getPosts();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex flex-col p-3 bg-white dark:bg-gray-800  gap-4 md:w-52 lg:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-slate-500 text-md uppercase">Total Users</h3>
              <p>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-blue-600 text-white rounded-full shadow-lg p-3 text-5xl" />
          </div>
          <div className="flex gap-2">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-slate-500">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 bg-white dark:bg-gray-800  gap-4 md:w-52 lg:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-slate-500 text-md uppercase">Total Posts</h3>
              <p>{totalPosts}</p>
            </div>
            <HiAnnotation className="bg-cyan-600 text-white rounded-full shadow-lg p-3 text-5xl" />
          </div>
          <div className="flex gap-2">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-slate-500">Last Month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-96 shadow-md mt-3 p-2 rounded-md bg-white   dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button outline gradientDuoTone="cyanToBlue">
              <Link to="/dashboard?tab=users">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((x) => {
                return (
                  <Table.Body key={x._id} className="divide-y">
                    <Table.Row className="bg-white   dark:bg-gray-800">
                      <Table.Cell>
                        <img
                          src={x.profilePicture}
                          alt="user"
                          className="w-10 h-10 rounded-full bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell>{x.userName}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                );
              })}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-96 shadow-md mt-3 p-2 rounded-md bg-white dark:bg-gray-800 ">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Button outline gradientDuoTone="cyanToBlue">
              <Link to="/dashboard?tab=posts">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post </Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((x) => {
                return (
                  <Table.Body key={x._id} className="divide-y">
                    <Table.Row className="bg-white dark:bg-gray-800 ">
                      <Table.Cell>
                        <img
                          src={x.image}
                          alt="user"
                          className="w-14 h-10 rounded-md bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell>{x.title}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                );
              })}
          </Table>
        </div>
      </div>
    </div>
  );
}
