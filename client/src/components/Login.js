import React, { Fragment } from "react";
import axios from "axios";
class Login extends React.Component {
  state = { roll: "", password: "" };
  onChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = async (e) => {
    e.preventDefault();
    if (this.state.roll === "") {
      return alert("Enter roll number");
    }
    if (this.state.password === "") {
      return alert("Enter password");
    }
    try {
      var res = await axios.post(
        "http://localhost:5001/vikas-school/us-central1/api/login",
        {
          roll: this.state.roll,
          password: this.state.password,
        }
      );

      localStorage.setItem("token", res.data.token);
      this.props.history.push("/class");
    } catch (err) {
      console.log(err, err.response);
      alert(err.response.data);
    }
  };
  render() {
    if (localStorage.getItem("token")) {
      this.props.history.push("/yourClass");
    }
    const { roll, password } = this.state;
    return (
      <Fragment>
        <form
          onSubmit={(e) => {
            this.onSubmit(e);
          }}
        >
          <input
            type="text"
            value={roll}
            name="roll"
            onChange={(e) => this.onChange(e)}
            placeholder="Roll Number"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => this.onChange(e)}
            placeholder="Password"
          />
          <input type="submit" />
        </form>
      </Fragment>
    );
  }
}
export default Login;
