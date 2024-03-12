"use client";
import React, { useState } from "react";
import axios from "axios";

const UploadVideo = () => {
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [media, setMedia] = useState<File | null>(null);
  const [videoId, setVideoId] = useState<string>("");
  const uploadVideo = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (media) {
        formData.append("media", media);
      }

      const response = await axios.post("/api/YT", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const rsp_data = response.data;
      if (response.status === 200) {
        setIsUploaded(true);
        console.log(rsp_data);
        setVideoId(rsp_data?.id);
      } else {
        setIsUploaded(false);
      }
    } catch (error) {
      setIsUploaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Title"
        onChange={(e) => {
          setTitle(e.target.value);
          console.log(title);
        }}
        className="text-black"
      />
      <input
        type="text"
        placeholder="Enter Description"
        onChange={(e) => {
          setDescription(e.target.value + " Uploded via YTLayer v1");
          console.log(description);
        }}
        className="text-black"
      />
      <input
        type="file"
        accept="video/*"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            console.log(files[0]);
            setMedia(files[0]);
          }
        }}
      />
      <button onClick={uploadVideo} disabled={isLoading}>
        Upload Video
      </button>
      {isLoading && <p>Uploading...</p>}
      {!isLoading &&
        (isUploaded ? (
          <p>
            Video Uploaded{" "}
            {videoId !== "" && (
              <a href={`https://www.youtube.com/watch?v=${videoId}`}>
                Video Link
              </a>
            )}
          </p>
        ) : (
          <p>Not uploaded or having issues</p>
        ))}
    </div>
  );
};

export default UploadVideo;
