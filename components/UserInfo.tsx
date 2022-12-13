import { Loader } from '@mantine/core';
import React from 'react';
import { useQueryUser } from '../hooks/useQueryUser';

export const UserInfo = () => {
  const { data: user, status } = useQueryUser();
  if (status === 'loading') return <Loader />;
  return (
    <div>
      <div>{user?.email}</div>
    </div>
  );
};
