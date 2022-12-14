import { Task } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import useStore from '../store';
import { EditedTask } from '../types';

export const useMutateTask = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const reset = useStore((state) => state.resetEditedTask);

  // タスクの作成
  const createTaskMutation = useMutation(
    async (task: Omit<EditedTask, 'id'>) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/todo`,
        task,
      );
      return res.data;
    },
    {
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks']);
        if (previousTodos) {
          queryClient.setQueryData(['tasks'], [res, ...previousTodos]);
        }
        reset();
      },
      onError: (err: any) => {
        reset();
        if (err.response.status === 401 || err.response.status === 403) {
          router.push('/');
        }
      },
    },
  );

  // タスクの更新
  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/${task.id}`,
        task,
      );
      return res.data;
    },
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks']);
        if (previousTodos) {
          queryClient.setQueryData(
            ['tasks'],
            previousTodos.map((task) => (task.id === res.id ? res : task)),
          );
        }
        reset();
      },
      onError: (err: any) => {
        reset();
        if (err.response.status === 401 || err.response.status === 403) {
          router.push('/');
        }
      },
    },
  );

  // タスクの削除
  const deleteTaskMutation = useMutation(
    async (id: number) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/todo/${id}`);
    },
    {
      onSuccess: (_, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks']);
        if (previousTodos) {
          queryClient.setQueryData(
            ['tasks'],
            previousTodos.filter((task) => task.id !== variables),
          );
        }
        reset();
      },
      onError: (err: any) => {
        if (err.response.status === 401 || err.response.status === 403) {
          router.push('/');
        }
      },
    },
  );

  return { createTaskMutation, updateTaskMutation, deleteTaskMutation };
};
