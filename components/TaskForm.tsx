import { Button, Center, TextInput } from '@mantine/core';
import { IconDatabase } from '@tabler/icons';
import React from 'react';
import { useMutateTask } from '../hooks/useMutateTask';
import useStore from '../store';

export const TaskForm = () => {
  const { editedTask } = useStore();
  const update = useStore((state) => state.updateEditedTask);
  const { createTaskMutation, updateTaskMutation } = useMutateTask();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // prevent the page from refreshing
    e.preventDefault();
    if (editedTask.id === 0) {
      createTaskMutation.mutate({
        title: editedTask.title,
        description: editedTask.description,
      });
    } else {
      updateTaskMutation.mutate({
        id: editedTask.id,
        title: editedTask.title,
        description: editedTask.description,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextInput
          mt="md"
          placeholder="Title"
          value={editedTask.title || ''}
          onChange={(e) => update({ ...editedTask, title: e.target.value })}
        />
        <TextInput
          mt="md"
          placeholder="description"
          value={editedTask.description || ''}
          onChange={(e) =>
            update({ ...editedTask, description: e.target.value })
          }
        />
        <Center mt="md">
          <Button
            disabled={editedTask.title === ''}
            leftIcon={<IconDatabase size={14} />}
            color="cyan"
            type="submit"
          >
            {editedTask.id === 0 ? 'Create' : 'Update'}
          </Button>
        </Center>
      </form>
    </div>
  );
};
