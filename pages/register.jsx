import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "@/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import Link from "next/link";
import toast from "react-hot-toast";

function register() {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const { authUser, isloading, setAuthUser } = useAuth();

  const provider = new GoogleAuthProvider();

  const router = useRouter();

  useEffect(() => {
    if (!isloading && authUser) {
      router.push("/");
    }
  }, [authUser, isloading]);

  const signupHandler = async () => {
    if (!username || !email || !password) return;
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      setAuthUser({
        uid: user.uid,
        email: user.email,
        username,
      });
    } catch (error) {
      console.log("error found", error);
      const message = JSON.parse(JSON.stringify(error));
      toast.error(message.code.replace(/^auth\//, ""));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
    } catch (error) {
      console.log("error found", error);
    }
  };

  return isloading || (!isloading && authUser) ? (
    <Loader />
  ) : (
    <div className="flex lg:h-[100vh]">
      <div className="w-full p-8 flex justify-center items-center">
        <div className="p-8 w-[560px]">
          <h1 className="text-5xl font-semibold ">Sign Up</h1>
          <p className="mt-4">
            Already have an account ?{" "}
            <Link
              href={"/login"}
              className="underline cursor-pointer hover:text-yellow-500"
            >
              Login
            </Link>
          </p>
          <div
            onClick={signInWithGoogle}
            className="mt-10 flex w-full bg-gray-300 justify-center items-center gap-4 py-3 rounded-full cursor-pointer transition-transform active:scale-90 hover:bg-black/90  hover:text-white"
          >
            <FcGoogle size={22} />
            <span className="font-medium">Login with Google</span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="mt-10 pl-1 flex flex-col">
              <label htmlFor="">Name</label>
              <input
                type="text"
                required
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                className="font-medium border-b border-black p-2 outline-0 focus-within:border-yellow-400"
              />
            </div>
            <div className="mt-8 pl-1 flex flex-col">
              <label htmlFor="">Email</label>
              <input
                type="email"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="font-medium border-b border-black p-2 outline-0 focus-within:border-yellow-400"
              />
            </div>
            <div className="mt-8 pl-1 flex flex-col">
              <label htmlFor="">Password</label>
              <input
                type="password"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="font-medium border-b border-black p-2 outline-0 focus-within:border-yellow-400"
              />
            </div>

            <button
              onClick={signupHandler}
              className="mt-10 bg-black w-32 py-3 text-white font-semibold rounded-full hover:bg-black/90 active:scale-90 transition-transform"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default register;
