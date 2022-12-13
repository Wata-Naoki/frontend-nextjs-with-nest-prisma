import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import * as Yup from 'yup'; // Yup is a JavaScript schema builder for value parsing and validation.
import { IconDatabase } from '@tabler/icons';
import { ShieldCheckIcon } from '@heroicons/react/solid';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import {
  Anchor,
  TextInput,
  Button,
  Group,
  PasswordInput,
  Alert,
} from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AuthForm } from '../types';
import axios from 'axios';
import { Layout } from '../components/Layout';

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('No email provided'),
  password: Yup.string().required('No password provided').min(5, 'Too short'),
});

const Home = () => {
  console.log(process.env.NEXT_PUBLIC_API_URL, 'NEXT_PUBLIC_API_URL');
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [isError, setIsError] = useState('');
  const form = useForm<AuthForm>({
    validate: yupResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  });
  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
          email: form.values.email,
          password: form.values.password,
        });
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: form.values.email,
        password: form.values.password,
      });
      form.reset();
      router.push('/dashboard');
    } catch (e: any) {
      setIsError(e.response.data.message);
    }
  };

  return (
    <Layout title="Auth">
      <ShieldCheckIcon className="h-16 w-16 text-green-500" />
      {isError && (
        <Alert
          my="md"
          variant="filled"
          icon={<ExclamationCircleIcon />}
          color="red"
          title="Authorization error"
          radius="md"
        >
          {isError}
        </Alert>
      )}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          mt="md"
          id="email"
          label="Email*"
          placeholder="Enter your email"
          {...form.getInputProps('email')}
          autoComplete="on"
        />
        <PasswordInput
          mt="md"
          id="password"
          label="Password*"
          description="At least 5 characters"
          {...form.getInputProps('password')}
          autoComplete="on"
        />
        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            size="xs"
            className="text-gray-300"
            onClick={() => {
              setIsRegister(!isRegister);
              setIsError('');
            }}
          >
            {isRegister
              ? 'Already have an account? Login'
              : 'Need an account? Register'}
          </Anchor>
          <Button
            type="submit"
            leftIcon={<IconDatabase size={14} />}
            color="cyan"
          >
            {isRegister ? 'Register' : 'Login'}
          </Button>
        </Group>
      </form>
    </Layout>
  );
};

export default Home;
