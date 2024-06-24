import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function MADashProfile() {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  const { currentUser, error, loading } = useSelector((state) => state.user);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(error.message);
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.values(formData).length === 0) {
      setUpdateUserError("No Changes Made");
    } else {
      dispatch(updateStart());
      axios
        .put(
          `http://localhost:3000/api/user/update/${
            currentUser.data?.user?._id || currentUser._id
          }`,
          formData
        )
        .then((res) => {
          console.log(res)
          if (res?.data?.isSuccessfull == true) {
            dispatch(updateSuccess(res?.data?.data));
            setUpdateUserSuccess("Successfully updated");
          } else {
            dispatch(updateFailure(res?.data?.error));
            setUpdateUserError(res?.data?.error);
          }
        })
        .catch((err) => {
          dispatch(updateFailure(err.message));
        });
    }
  };

  const handleDeleteUser = () => {
    setShowModal(false);
    dispatch(deleteUserStart());
    axios
      .delete(
        `http://localhost:3000/api/user/delete/${
          currentUser.data?.user?._id || currentUser._id
        }`
      )
      .then((res) => {
        if (res?.data?.isSuccessfull == true) {
          dispatch(deleteUserSuccess(res?.data?.data));
        } else {
          dispatch(deleteUserFailure(res?.data?.error));
        }
      })
      .catch((err) => {
        dispatch(deleteUserFailure(err.message));
      });
  };

  const handleSignOut = () => {
    axios
      .post("http://localhost:3000/api/user/signOut")
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

  return (
    <div className="max-w-lg mx-auto w-full p-3 my-5 md:my-1">
      <h1 className="my-7 font-bold text-center text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          className="hidden"
        />
        <div
          onClick={() => filePickerRef.current.click()}
          className={`relative w-32 h-32 cursor-pointer shadow-md rounded-full self-center ${
            imageFileUploadProgress &&
            imageFileUploadProgress < 100 &&
            "opacity-50"
          }`}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62 , 152 , 199 , ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={
              imageFileUrl ||
              currentUser.profilePicture ||
              currentUser.data?.user?.profilePicture
            }
            alt="user"
            className="rounded-full w-full h-full border-8 border-gray-300 object-cover"
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="userName"
          placeholder="Username"
          defaultValue={
            currentUser?.data?.user?.userName || currentUser.userName
          }
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser?.data?.user?.email || currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="cyanToBlue"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
        {(currentUser.data?.user?.isAdmin || currentUser.isAdmin) && (
          <Link to="/create-post">
            <Button
              type="button"
              gradientDuoTone="cyanToBlue"
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      {updateUserSuccess && <Alert color="success">{updateUserSuccess}</Alert>}
      {updateUserError && <Alert color="failure">{updateUserError}</Alert>}
      {error && <Alert color="failure">{error}</Alert>}
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
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-between">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I am sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
