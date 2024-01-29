import { FiLogOut } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
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
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import moment from "moment";

export default function Home() {
  const [reminderInput, setReminderInput] = useState("");
  const [datetimeInput, setDatetimeInput] = useState("");
  const [reminderList, setReminderList] = useState([]);

  const { authUser, isloading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isloading && !authUser) {
      router.push("/login");
    }
    if (!!authUser) {
      fetchReminder(authUser.uid);
    }
  }, [authUser, isloading]);

  const addReminder = async () => {
    if (reminderInput) {
      try {
        const docRef = await addDoc(collection(db, "reminders"), {
          owner: authUser.uid,
          content: reminderInput,
          datetime: datetimeInput,
          completed: false,
        });
        fetchReminder(authUser.uid);
        setReminderInput("");
        setDatetimeInput("");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteReminder = async (docId) => {
    try {
      await deleteDoc(doc(db, "reminders", docId));
      fetchReminder(authUser.uid);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsCompletedHandler = async (event, docId) => {
    try {
      const docRef = doc(db, "reminders", docId);
      await updateDoc(docRef, {
        completed: event.target.checked,
      });
      fetchReminder(authUser.uid);
    } catch (error) {
      console.error(error);
    }
  };

  const onKeyUp = (event) => {
    if (event.key === "Enter" && reminderInput.length > 0) {
      addReminder();
    }
  };

  const fetchReminder = async (uid) => {
    try {
      const q = query(collection(db, "reminders"), where("owner", "==", uid));
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        data.push({ ...doc.data(), id: doc.id });
      });
      setReminderList(data);
    } catch (error) {
      console.error(error);
    }
  };

  return !authUser ? (
    <Loader />
  ) : (
    <main className="">
      <div
        onClick={signOut}
        className="bg-black text-white w-14 h-14 py-4 flex items-center justify-center rounded-lg cursor-pointer mt-10 shadow-md fixed bottom-5 right-5 hover:bg-black/90 active:scale-90 transition-transform gap-2 font-medium active:bg-red-500"
      >
        <FiLogOut size={20} />
      </div>
      <div className="max-w-3xl mx-auto mt-4 p-8">
        <div className="py-3 bg-white sticky top-0">
          <div className="flex items-center justify-center flex-col">
            <span className="text-4xl mb-2">🔔</span>
            <h1 className="text-4xl md:text-5xl font-bold">Remonder's</h1>
          </div>
          <div className="flex justify-center items-center mt-6 gap-2 flex-col sm:flex-row">
            <div className="flex flex-col w-full grow gap-1">
              <input
                type="text"
                placeholder={`👋🏻 Hello ${authUser.username} , What should i remind you`}
                value={reminderInput}
                onChange={(e) => {
                  setReminderInput(e.target.value);
                }}
                onKeyUp={onKeyUp}
                className="font-semibold border-[2px] border-black h-[40px] px-4 shadow-md rounded-md focus-visible:outline-yellow-400 text-lg transition-all duration-200"
              />
              <input
                value={datetimeInput}
                onChange={(e) => {
                  setDatetimeInput(e.target.value);
                }}
                type="datetime-local"
                onKeyUp={onKeyUp}
                className="font-semibold border-[2px] border-black h-[40px]  px-4 shadow-md rounded-md focus-visible:outline-yellow-400 text-lg transition-all duration-200"
              />
            </div>
            <button
              onClick={addReminder}
              className="bg-black h-[40px] w-full sm:h-[80px] sm:w-[80px] text-white  flex justify-center items-center shadow-md rounded-md hover:bg-black/90 active:bg-yellow-400 active:scale-90 transition-transform"
            >
              <FaPlus size={20} />
            </button>
          </div>
        </div>
        <div className="my-6">
          {reminderList.length > 0 &&
            reminderList.map((reminder, index) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between mt-4"
              >
                <div className="flex items-center gap-3 ">
                  <input
                    id={`reminder-${reminder.id}`}
                    type="checkbox"
                    className="h-5 w-5 accent-green-400 rounded-lg "
                    checked={reminder.completed}
                    onChange={(e) => markAsCompletedHandler(e, reminder.id)}
                  />
                  <div className="flex flex-col">
                    <label
                      htmlFor={`reminder-${reminder.id}`}
                      className={`font-medium text-lg ${
                        reminder.completed ? "line-through" : ""
                      }`}
                    >
                      {reminder.content}
                    </label>
                    {reminder.datetime && (
                      <span
                        className={`text-xs font-sans font-medium text-gray-500 ${
                          reminder.completed ? "line-through" : ""
                        } `}
                      >
                        {moment(reminder.datetime).format(
                          "MMM D, YYYY, h:mm a"
                        )}{" "}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 ">
                  <MdDeleteForever
                    onClick={() => deleteReminder(reminder.id)}
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
