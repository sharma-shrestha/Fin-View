// src/pages/SignupForm.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import GoogleLogin from "./GoogleLogin";
import { VscGraph } from "react-icons/vsc";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formSchema = z.object({
    name: z.string().min(3, "Full Name is required"),
    email: z.string().email(),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      const response = await fetch(`${getEnv("VITE_API_URL")}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }

      showToast("success", data.message);
      navigate("/");
    } catch (err) {
      showToast("error", err.message || "Server error");
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="w-96 bg-slate-800 border border-slate-600 rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6 text-3xl">
          <VscGraph />
        </div>
        <h2 className="mb-6 text-2xl font-semibold text-center">
          Welcome!
          <p className="text-sm text-gray-300">Take charge of your finance</p>
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-white">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full Name"
                      {...field}
                      className="bg-slate-700 border border-slate-600 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email Address"
                      {...field}
                      className="bg-slate-700 border border-slate-600 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-white">Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+91 0000000000"
                      {...field}
                      className="bg-slate-700 border border-slate-600 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="bg-slate-700 border border-slate-600 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-3 bg-[#006d77] text-white font-bold rounded-lg hover:bg-[#005962] transition mb-4"
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>
          </form>
        </Form>
        <p className="text-sm text-gray-300 mb-5 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>

        <div className="flex items-center justify-center text-xs text-gray-400 mb-4">
          <span>OR</span>
        </div>

        {/* Google Login */}
        <div className="w-full">
          <GoogleLogin
            className="w-full py-2 bg-black text-white font-semibold rounded-lg border border-white"
          />
        </div>
      </div>
    </div>

  );
};

export default SignUp;
