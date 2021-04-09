import React, { Fragment } from "react";
import axios from "axios";
class Class extends React.Component {
  componentDidMount() {
    // this.getVideo();
    const interval = setInterval(async () => {
      try {
        var res = await axios.get(
          "http://localhost:5001/vikas-school/us-central1/api/checkSession",
          { headers: { "x-auth-token": localStorage.getItem("token") } }
        );
      } catch (err) {
        console.log(err, err.response);
        clearInterval(interval);
        alert(
          "Duplicate session detected. You have been logged out. Try after 2 minutes."
        );
        localStorage.removeItem("token");
        this.props.history.push("/");
      }
    }, 60000);
  }
  getVideo = async () => {
    var res = await axios.get(
      "http://localhost:5001/vikas-school/us-central1/api/video/sample.mp4",
      { headers: { "x-auth-token": localStorage.getItem("token") } }
    );
    console.log(res);
    document.getElementById("hi").src = res.data;
  };
  ascii_to_hexa = (str) => {
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n++) {
      var hex = Number(str.charCodeAt(n)).toString(16);
      arr1.push(hex);
    }
    return "%" + arr1.join("%");
  };
  render() {
    return (
      <Fragment>
        <video controls>
          <source
            id="hi"
            src="http://localhost:5001/vikas-school/us-central1/api/video/sample.mp4"
          />
        </video>
      </Fragment>
    );
  }
}

export default Class;
