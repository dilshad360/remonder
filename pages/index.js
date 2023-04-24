import { FiLogOut } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const arr = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore"
import { db } from "@/firebase/firebase";

export default function Home() {

  const [reminder, setReminder] = useState("");
  const [reminderList, setReminderList] = useState([]);

  const {authUser, isLoading, signOut} = useAuth();
  const router = useRouter()

  useEffect(()=>{
    if(!isLoading && !authUser) {
        router.push("/login");
    }
  },[authUser, isLoading])

  return !authUser ? (<Loader/>) : (
    <main className="">
      <div onClick={signOut} className="bg-black text-white w-14 h-14 py-4 flex items-center justify-center rounded-lg cursor-pointer mt-10 shadow-md fixed bottom-5 right-5 hover:bg-black/90 active:scale-90 transition-transform gap-2 font-medium active:bg-red-500">
        <FiLogOut size={20} />
      </div>
      <div className="max-w-3xl mx-auto mt-4 p-8">
        <div className="py-3 bg-white sticky top-0">
          <div className="flex items-center justify-center flex-col">
            <span className="text-4xl mb-2">🔔</span>
            <h1 className="text-4xl md:text-5xl font-bold">Remonder's</h1>
          </div>
          <div className="flex justify-center items-center mt-6 gap-2">
            <input
              type="text"
              placeholder="👋🏻 Write your reminder here ..."
              className="font-semibold border-[2px] border-black h-[60px] grow px-4 shadow-md rounded-md focus-visible:outline-yellow-400 text-lg transition-all duration-200"
            />
            <button className="bg-black h-[60px] w-[60px] text-white  flex justify-center items-center shadow-md rounded-md hover:bg-black/90 active:bg-yellow-400 active:scale-90 transition-transform">
              <FaPlus />
            </button>
          </div>
        </div>
        <div className="my-6">
          {arr.map((todo, index) => (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3 ">
                <input
                  id={`todo-${index}`}
                  type="checkbox"
                  className="h-4 w-4 accent-green-400 rounded-lg "
                />
                <label htmlFor={`todo-${index}`} className="font-medium">
                  This a todo
                </label>
              </div>
              <div className="flex items-center gap-3 ">
                <MdDeleteForever
                  size={24}
                  className="text-red-400 cursor-pointer hover:text-red-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
