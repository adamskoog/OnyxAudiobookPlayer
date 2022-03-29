import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../context/hooks';

import type { NextPage } from 'next'
import { getToken, checkToken, checkAuthId } from '../context/actions/appStateActions';
import { getServers } from '../context/actions/settingsActions';

import Home from '../components/Home';

const HomePage: NextPage = () => {

  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.application.user);
  const authToken = useAppSelector((state) => state.application.authToken);
  const authId = useAppSelector((state) => state.application.authId);

  useEffect(() => {
    if (!user) {
      // We have no user logged in, check for tokens.
      dispatch(getToken());
    } else dispatch(getServers());
  }, [user, dispatch]);

  useEffect(() => {
    if (authToken) {
      // We have a token stored, attempt to authenticate.
      dispatch(checkToken(authToken));
    } else if (authId) {
      // We have been redirected and now have an authorization id to handle.
      dispatch(checkAuthId(authId));
    }
  }, [authToken, authId, dispatch]);

  return (
      <Home />
  )
}

export default HomePage
