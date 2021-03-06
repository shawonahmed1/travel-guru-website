import React, { useContext } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../../firebaseConfig";
import { UserContext } from "../../App";
import { Link, useHistory, useLocation } from "react-router-dom";
import "./signUp.css";
import FacebookIcon from "@material-ui/icons/Facebook";
import googleIcon from "../images/google.png";

const SignUp = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  //firebase ------->
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  const GoogleProvider = new firebase.auth.GoogleAuthProvider();
  const FacebookProvider = new firebase.auth.FacebookAuthProvider();

  const handleGoogleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(GoogleProvider)
      .then (result => {
        var { displayName, email } = result.user;
        const signedInUser = { name: displayName, email };
        setLoggedInUser(signedInUser);
        history.replace(from);
      })
      .catch (error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  //handleGoogleSignIn end --->

  //handleFacebookSignIn start --->
  const handleFacebookSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(FacebookProvider)
      .then(result => {
        console.log(result.user);
        const { displayName, email } = result.user;
        
        const signedInUser = { name: displayName, email };
        setLoggedInUser(signedInUser);
        history.replace(from);

        // ...
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  //facebook validation end ----------->

  const handleInput = (e) => {
    let FormValid = true;
    if (e.target.name === "email") {
      FormValid = /\S+@\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const PasswordValid = e.target.value.length > 5;
      const PasswordNumberValid = /\d{1}/.test(e.target.value);
      FormValid = PasswordValid && PasswordNumberValid;
    }
    if (FormValid) {
      const newUserInfo = { ...loggedInUser };
      newUserInfo[e.target.name] = e.target.value;
      setLoggedInUser(newUserInfo);
    }
  };

  const handleSubmit = (e) => {
    // console.log(loggedInUser)
    if (loggedInUser.email && loggedInUser.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          loggedInUser.email,
          loggedInUser.password
        )
        .then((response) => {
          const newUserInfo = { ...loggedInUser };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setLoggedInUser(newUserInfo);
          updateUserName(loggedInUser.name);
          history.replace(from);
          console.log(response);
        })
        .catch((error) => {
          const newUserInfo = { ...loggedInUser };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setLoggedInUser(newUserInfo);
        });
    }
    e.preventDefault();
  };

  const updateUserName = (name) => {
    const user = firebase.auth().currentUser;

    user
      .updateProfile({
        displayName: name,
      })
      .then(function () {
        console.log("Update successful");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div style={{
       background: "black",
        height: "px",
         paddingBottom: "5%", 
         
         
         }}>
      <div
        style={{
          width: "50%",
          margin: "0 auto",
          padding: "20px",
          borderRadius: "10px",
          background: "#300",
          
          color: "white",
          border: "2px solid tomato",
          
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">
              <b>Your name</b>
            </label>
            <input
              type="name"
              required
              name="name"
              onBlur={handleInput}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">
              <b>Email address</b>
            </label>
            <input
              type="email"
              required
              name="email"
              onBlur={handleInput}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">
              <b>Password</b>
            </label>
            <input
              id="password"
              type="password"
              required
              name="password"
              onBlur={handleInput}
              className="form-control"
            />
          </div>
          <div className="form-group form-check">
            <input type="checkbox" className="form-check-input" />
            <label className="form-check-label">Check me out</label>
          </div>

          <button
            style={{ width: "100%" }}
            type="submit"
            className="btn btn-primary"
          >
            Submit
          </button>
        </form>
        <br />
        <p style={{ textAlign: "center" }}>
          Already have an account? <Link to="/Login">Sign in</Link>
        </p>
        <p style={{ color: "red" }}>{loggedInUser.error}</p>
        {loggedInUser.success && (
          <p style={{ color: "green" }}>User created successfully</p>
        )}

        <div style={{ margin: "0 auto", width: "50%" }}>
          <button
            style={{ width: "100%", backgroundColor: "tomato", color: "white" }}
            className="btn btn-outline-warning "
            onClick={handleGoogleSignIn}
          >
            <img
              style={{ height: "20px", width: "20px" }}
              src={googleIcon}
              alt=""
            />{" "}
            Continue With Google
          </button>
          <br />

          <button
            style={{ background: "blue", color: "white", width: "100%" }}
            className="btn btn-outline-primary"
            onClick={handleFacebookSignIn}
          >
            <b>
              {" "}
              <FacebookIcon /> Log in With Facebook
            </b>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
