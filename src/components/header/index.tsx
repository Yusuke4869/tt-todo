import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import "./style.scss";
import { signOut } from "~/stores/authSlice";
import { useSelector } from "~/stores/store";

import type { FC } from "react";

export const Header: FC = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies();

  const handleSignOut = () => {
    dispatch(signOut());
    removeCookie("token");
    navigate("/signin");
  };

  return (
    <header className="header">
      <h1>
        <Link to="/">Todoアプリ</Link>
      </h1>
      {auth && <button onClick={handleSignOut}>サインアウト</button>}
    </header>
  );
};
