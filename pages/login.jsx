import React, {useEffect, useState} from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "@/firebase/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import Link from "next/link";
import toast from "react-hot-toast";

const provider = new GoogleAuthProvider();

function login() {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const {authUser, isLoading} = useAuth();

  const router = useRouter()

  useEffect(()=>{
    if(!isLoading && authUser) {
        router.push("/");
    }
  },[authUser, isLoading])

  const loginHandler = async()=>{
    if(!email || !password) return;
    try {
        const user = await signInWithEmailAndPassword(auth, email, password )
        console.log(user)
    } catch (error) {
        console.log("error found", error)
        const message = JSON.parse(JSON.stringify(error))
        toast.error(message.code.replace(/^auth\//, ""))
    }
  }

  const signInWithGoogle = async() => {
    try {
        const user = await signInWithPopup(auth, provider)
    } catch (error) {
        console.log("error found", error)
    }
  }

  return isLoading || (!isLoading && authUser) ? (<Loader/>) : (
    <div className="flex lg:h-[100vh]">
      <div className="w-full p-8 flex justify-center items-center">
        <div className="p-8 w-[560px]">
          <h1 className="text-5xl font-semibold ">Login</h1>
          <p className="mt-4">
            Don't have an account ?{" "}
            <Link href={"/register"} className="underline cursor-pointer hover:text-yellow-500">
              Sign up
            </Link>
          </p>
          <div onClick={signInWithGoogle} className="mt-10 flex w-full bg-gray-300 justify-center items-center gap-4 py-3 rounded-full cursor-pointer transition-transform active:scale-90 hover:bg-black/90  hover:text-white">
            <FcGoogle size={22} />
            <span className="font-medium">Login with Google</span>
          </div>
          <form onSubmit={(e)=>{e.preventDefault()}}>
          <div className="mt-10 pl-1 flex flex-col">
            <label htmlFor="">Email</label>
            <input
                onChange={(e)=>{
                    setEmail(e.target.value)
                }}
              type="email"
              required
              className="font-medium border-b border-black p-2 outline-0 focus-within:border-yellow-400"
            />
          </div>
          <div className="mt-8 pl-1 flex flex-col">
            <label htmlFor="">Password</label>
            <input
            onChange={(e)=>{
                setPassword(e.target.value)
            }}
              type="password"
              required
              className="font-medium border-b border-black p-2 outline-0 focus-within:border-yellow-400"
            />
          <Link className="mt-3 text-right text-sm underline cursor-pointer hover:text-yellow-500" href="/forgotpassword">Forgot password?</Link>
          </div>
          <button onClick={loginHandler} className="mt-10 bg-black w-32 py-3 text-white font-semibold rounded-full hover:bg-black/90 active:scale-90 transition-transform">
            Sign In
          </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default login;
