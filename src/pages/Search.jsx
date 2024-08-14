import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MAPostCard from "../components/MAPostCard";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  console.log(sidebarData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showErr, setShowErr] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
    const getPosts = () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      axios
        .get(`https://rehman-blog-backend.vercel.app/api/post/getPosts?${searchQuery}`)
        .then((res) => {
          if (res.data?.isSuccessfull) {
            console.log(res);
            setPosts([...res.data?.data?.posts]);
            setLoading(false);
            if (res.data?.data?.posts.length === 9) {
              setShowMore(true);
            }
            else{
              setShowMore(false);
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          setShowErr(true);
          setLoading(false);
        });
    };
    getPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category: category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = () => {
    const startIndex = posts.length
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("startIndex", startIndex)
    const searchQuery = urlParams.toString()
    axios.get(`https://rehman-blog-backend.vercel.app/api/post/getPosts?${searchQuery}`)
    .then((res) => {
      if(res.data?.isSuccessfull){
        setPosts([...posts,...res.data?.data?.posts])
        if(res.data?.data?.posts.length === 9){
          setShowMore(true)
        }
        else{
        setShowMore(false)
        }
      }
      else{
        setShowErr(res.data?.error)
      }
    })
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex items-center">
            <label className="whitespace-nowrap font-semibold">
              SearchTerm:
            </label>
            <TextInput
              placeholder="Search"
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} id="sort" value={sidebarData.sort}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              id="category"
              value={sidebarData.category}
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">Javascript</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="cyanToBlue">
            Search
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No Posts Found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((x) => {
              return <MAPostCard key={x._id} post={x} />;
            })}
          {showMore && (
            <button onClick={handleShowMore} className="text-blue-500 text-lg hover:underline p-7 w-full">
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
