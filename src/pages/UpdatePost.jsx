import { FileInput, Select, TextInput, Button, Alert } from "flowbite-react";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setimageUploadProgress] = useState(null);
  const [imageUploadError, setimageUploadError] = useState(null);
  const [formData, setformData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://rehman-blog-backend.vercel.app/api/post/getPosts?postId=${params.id}`)
      .then((res) => {
        if (res.data?.isSuccessfull) {
          setformData({...res.data?.data?.posts[0]});
          console.log(formData)
        } else {
          setPublishError(res.data?.error);
        }
      })
      .catch((err) => {
        setPublishError(err.message);
      });
  }, []);
  useEffect(() => {
  console.log(formData);
}, [formData]);
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setimageUploadError("Please Select an image");
        return;
      }
      setimageUploadError(null);
      setimageUploadProgress(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setimageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setimageUploadError(error.message);
          setimageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setimageUploadProgress(null);
            setimageUploadError(null);
            setformData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setimageUploadError(error.message);
      setimageUploadProgress(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    axios
      .put(
        `https://rehman-blog-backend.vercel.app/api/post/updatePost/${params.id}`,
        formData
      )
      .then((res) => {
        console.log(res);
        if (res?.data?.isSuccessfull == true) {
          setPublishError(null);
          navigate(`/post/${res?.data?.data?.slug}`);
        } else {
          setPublishError(res?.data?.error);
        }
      })
      .catch((err) => {
        setPublishError(err.message);
      });
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setformData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) => {
              setformData({
                ...formData,
                category: e.target.value,
              });
            }}
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-blue-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="cyanToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}% `}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write Something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setformData({
              ...formData,
              content: value,
            });
          }}
          value={formData.content}
        />
        <Button type="submit" gradientDuoTone="cyanToBlue">
          Update Post
        </Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
