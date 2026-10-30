import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

// Sign-up form: validates in the browser, then sends the data to the backend.
function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};

    if (name.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await api.post("/auth/signup", { name, email, phone, password });
      setServerMsg(res.data.message);
      setSubmitted(true);
    } catch (err) {
      setServerMsg(err.response?.data?.message || "Server not reachable");
    }
  }

  if (submitted) {
    return (
      <div className="page">
        <h1>Thank you, {name}!</h1>
        <p className="success-msg">{serverMsg}</p>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <p className="error-msg">{errors.name}</p>}

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p className="error-msg">{errors.email}</p>}

        <label>Mobile Number</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        {errors.phone && <p className="error-msg">{errors.phone}</p>}

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <p className="error-msg">{errors.password}</p>}

        <button type="submit">Submit</button>
        {serverMsg && <p className="error-msg">{serverMsg}</p>}
      </form>
    </div>
  );
}

export default Registration;
