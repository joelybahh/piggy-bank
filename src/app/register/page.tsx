import React from 'react';
import { redirect } from 'next/navigation';
import FormInput from '@/components/FormInput';

async function signupUser(formData: FormData) {
  'use server';
  
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Here you would typically validate the input and create a new user in your backend
  // For this example, we'll just log the attempt and redirect
  console.log('Signup attempt:', { firstName, lastName, email, password, confirmPassword });

  // Implement your actual signup logic here
  // If signup is successful, redirect to the dashboard or a welcome page
  redirect('/dashboard');
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Create Your Piggy Bank Account</h2>
        <form action={signupUser}>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              required
            />
            <FormInput
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              required
            />
          </div>
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
            placeholder="Create a password"
            required
          />
          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mt-4"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-purple-600 hover:text-purple-500">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
}