import styled from "styled-components";
import { useSelector } from "react-redux";
import { Loading, SelectDifficulty } from "../../Components";
import { useDispatch } from "react-redux";
import {
  getUserInputs,
  uploadImage,
  completeProfile,
  handleEditProfile,
} from "../../features/user/userSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

let formData = new FormData();

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { user, profileEditing } = useSelector((store) => store.user);
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchImage(user.profilePic);
    formData.delete("profilepic");
  }, [user.profilePic]);

  async function fetchImage(image) {
    setLoading(true);
    const response = await fetch(image);
    const { status, url } = response;
    if (status === 200) {
      setImage(url);
      setLoading(false);
    }
  }

  // HANDLE IMAGE
  const handleImage = (event) => {
    event.preventDefault();
    const image = event.target.files[0];
    formData.append("profilepic", image);
    dispatch(uploadImage(formData));
  };
  // HANDLE USER INPUT ONCHANGE
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    dispatch(getUserInputs({ name, value }));
  };

  const handleCompleteProfile = (e) => {
    e.preventDefault();

    const name = e.target.name;
    if (name === "Skip") {
      return navigate("/dashboard");
    } else if (name === "Skip" && profileEditing) {
      dispatch(handleEditProfile());
      return;
    } else {
      toast.success("Profile Updated Successfully");
      dispatch(completeProfile());
      dispatch(handleEditProfile());
      navigate("/dashboard");
    }
  };

  return (
    <Wrapper className="full-page">
      <h2>{profileEditing ? "Edit " : "Complete"} your profile</h2>
      <section>
        {profileEditing ? (
          <p>Enter the details to update your profile</p>
        ) : (
          <p>
            Please Complete your profile and if this is skipped, it is set to
            default.
          </p>
        )}

        <div>
          <label>Profile Picture:</label>
          <div className="image-bg">
            {loading ? (
              <Loading height={20} width={20} color={"red"} />
            ) : (
              <img src={image} alt={user.username} />
            )}
          </div>
        </div>
      </section>

      <SelectDifficulty
        handleChange={handleChange}
        difficulty={user.difficulty}
      />
      <div>
        <label>Upload Profile picture: </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          name="profilepic"
        />
      </div>
      <footer>
        <button type="submit" name="Skip" onClick={handleCompleteProfile}>
          {profileEditing ? "Cancel" : "Skip"}
        </button>
        <button type="submit" name="Complete" onClick={handleCompleteProfile}>
          {profileEditing ? "Update" : "Complete"}
        </button>
      </footer>
    </Wrapper>
  );
};

const Wrapper = styled.form`
  text-align: center;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  .image-bg {
    background-color: whitesmoke;
    width: 100px;
    height: 100px;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 100px;
    height: 100px;
  }
  footer {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    position: fixed;
    bottom: 100px;
  }
  footer button {
    padding: 10px 30px;
  }
`;

export default CompleteProfilePage;
