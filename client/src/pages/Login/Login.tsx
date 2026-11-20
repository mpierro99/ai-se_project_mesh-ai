import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { useAuth } from "../../contexts/AuthContext";
import { loginUser } from "../../utils/api";

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? "form__tab form__tab_active" : "form__tab";
}

export default function Login() {
  const { values, errors, isValid, handleChange } = useFormWithValidation();
  const [submitError, setSubmitError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;
    setSubmitError("");
    try {
      const res = await loginUser(values.email, values.password);
      if (res.data) {
        login(res.data.token, res.data.user);
        navigate("/knowledge");
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="auth">
      <header className="header">
        <img className="header__logo" alt="MeshAI logo" src={logo} />
      </header>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__heading">
          <h1 className="form__title">Sign in</h1>
          <p className="form__subtitle">
            Access your organisation's secure workspace
          </p>
        </div>

        <div className="form__tabs">
          <NavLink to="/login" className={getNavLinkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={getNavLinkClass}>
            Register
          </NavLink>
        </div>

        <div className="form__fields">
          <label className="form__label">
            Email
            <input
              className="form__input"
              name="email"
              type="email"
              placeholder="johndoe12345@gmail.com"
              required
              value={values.email ?? ""}
              onChange={handleChange}
            />
            {errors.email && <span className="form__error">{errors.email}</span>}
          </label>

          <label className="form__label">
            Password
            <input
              className="form__input"
              name="password"
              type="password"
              minLength={8}
              required
              value={values.password ?? ""}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="form__error">{errors.password}</span>
            )}
          </label>
        </div>

        <button className="form__submit-btn" type="submit" disabled={!isValid}>
          Login
        </button>
        <p className="form__status" role="alert">
          {submitError}
        </p>
      </form>
    </div>
  );
}
