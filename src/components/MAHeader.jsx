import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineArrowDown, AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess, signOutFailure } from "../redux/user/userSlice";
import axios from "axios";
import { useEffect, useState } from "react";

export default function MAHeader() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInSm, setSearchInSm] = useState(false);
  console.log(searchTerm);

  const handleSignOut = () => {
    axios
      .post("https://rehman-blog-backend.vercel.app/api/user/signOut")
      .then((res) => {
        if (res?.data?.isSuccessfull == true) {
          dispatch(signOutSuccess());
        } else {
          dispatch(signOutFailure(res?.data?.error));
        }
      })
      .catch((err) => {
        dispatch(signOutFailure(err.message));
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleSubmitInSm = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setSearchInSm(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap  md:text-xl font-semibold"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-sky-300 to-blue-500 text-white rounded-lg">
          Rehman's
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden md:block"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      {!searchInSm ? (
        <Button
          className="w-12 h-10 md:hidden"
          onClick={() => setSearchInSm(!searchInSm)}
          color="gray"
        >
          <AiOutlineSearch />
        </Button>
      ):(
        <AiOutlineArrowDown className="md:hidden" onClick={() => setSearchInSm(false)}/>
      )}

      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:block"
          color="gray"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? "" : ""}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={
                  currentUser.data?.user?.profilePicture ||
                  currentUser.profilePicture
                }
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {currentUser.data?.user?.userName || currentUser.userName}
              </span>
              <span className="block text-sm font-medium truncate">
                {currentUser.data?.user?.email || currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item className="hover:text-black">
                Profile
              </Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item className="hover:text-black" onClick={handleSignOut}>
              Sign Out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="cyanToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
      </Navbar.Collapse>
      {searchInSm && (
        <form className="w-full mt-2" onSubmit={handleSubmitInSm}>
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="block  md:hidden"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      )}
    </Navbar>
  );
}
