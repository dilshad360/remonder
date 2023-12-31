import { auth } from '@/firebase/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react'
import { useRouter } from "next/router";



function forgotpassword() {

    const router = useRouter()

    const [email, setEmail] = useState(null);


    const resetHandler = async () => {
        if(!email) return;
        sendPasswordResetEmail(auth, email).then(data => {
            alert('Password reset link sent to your email.')
            router.push('/login')
        }).catch(err => {
            alert(err.code)
        })
    }



    return (
        <div className="flex lg:h-[100vh]">
            <div className="w-full p-8 flex justify-center items-center">
                <div className="p-8 w-[560px]">
                    <h1 className="text-5xl font-semibold ">Reset your password</h1>
                    <form onSubmit={(e) => { e.preventDefault(); resetHandler(); }}>
                        <div className="mt-10 pl-1 flex flex-col">
                            <label htmlFor="">Email</label>
                            <input
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                                type="email"
                                required
                                className="font-medium border-b border-black p-2 outline-0 focus-within:border-yellow-400"
                            />
                        </div>
                        <div class="group">
                        <button type='submit' className="mt-10 bg-black w-32 py-3 text-white font-semibold rounded-full hover:bg-black/90 active:scale-90 transition-transform flex justify-center items-center">
                            Reset
                            <span className='hidden group-hover:block animate-bounce'> &nbsp;🙄</span>
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default forgotpassword