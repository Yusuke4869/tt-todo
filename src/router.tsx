import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { Home, NotFound, SignIn, SignUp, NewTask, NewList, EditTask, EditList } from "~/pages";
import { useSelector } from "~/stores/store";

import type { FC } from "react";

export const Router: FC = () => {
  const auth = useSelector((state) => state.auth.isSignIn);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SignIn />} path="/signin" />
        <Route element={<SignUp />} path="/signup" />
        {auth ? (
          <>
            <Route element={<Home />} path="/" />
            <Route element={<NewTask />} path="/task/new" />
            <Route element={<NewList />} path="/list/new" />
            <Route element={<EditTask />} path="/lists/:listId/tasks/:taskId" />
            <Route element={<EditList />} path="/lists/:listId/edit" />
          </>
        ) : (
          <Route element={<Navigate to="/signin" />} path="/*" />
        )}
        <Route element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
