import React from 'react';
import { redirect } from 'next/navigation';
import FormInput from '@/components/FormInput';

async function loginUser(formData: FormData) {
  'use server';
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Here you would typically validate the credentials against your backend
  // For this example, we'll just log the attempt and redirect
  console.log('Login attempt:', { email, password });

  // Implement your actual login logic here
  // If login is successful, redirect to the dashboard
  redirect('/dashboard');
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Login to Piggy Bank</h2>
        <form action={loginUser}>
          <FormInput
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mt-4"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-purple-600 hover:text-purple-500">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}