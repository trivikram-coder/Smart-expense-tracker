import React from 'react'

const ForgetPass = () => {
  return (
   <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className='text-2xl font-bold mb-6 text-center'>Forget password</h2>
            <h2 className='text-xl font-normal mb-6 text-center'>
                Enter your email address to sent verification code 
            </h2>
        <form className='flex flex-col gap-4'>
            <input type="email" placeholder='Enter your email address' className='border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'/>
            
                <br />
                <button className='bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer'>Send Code</button>
            </form>
        </div>
    </div>

   </>
  )
}

export default ForgetPass
