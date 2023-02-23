import {Input} from "react-daisyui";
import {Link} from "react-router-dom";
import {useRef, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState(null);
  const {setUser, setToken} = useStateContext()
  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    setErrors(null)
    axiosClient.post('/login', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token)
      })
      .catch((err) => {
        const response = err.response;
        if(response && response.status === 422) {
          if(response.data.errors) {
            setErrors(response.data.errors)
          } else {
            setErrors({email: [response.data.message]})
          }

        }
        if(response && response.status === 401) {
          setErrors({email: [response.data.message]})
        }
      })
  }


  return (
    <>
      <form onSubmit={onSubmit}>
        <h1 className="text-2xl text-neutral-400 font-bold pb-2">Login</h1>
        {errors && <div>
          {Object.keys(errors).map((key) => (
            <div className="alert alert-warning shadow-lg my-2 ">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span key={key}>{errors[key][0]}</span>
              </div>
            </div>
          ))}
        </div>
        }
        <div className="mx-auto w-full pb-2">
          <label className="label">
            <span className="label-text  text-neutral-400 ">Email</span>
          </label>
          <input type="email"
                  ref={emailRef}
                 placeholder="john@doe.com"
                 className="input input-bordered w-full bg-neutral-700 placeholder-neutral-500" />

          </div>
          <div className="mx-auto w-full pb-2">
            <label className="label">
              <span className="label-text text-neutral-400">Password</span>
            </label>
            <input type="password"
                   ref={passwordRef}
                   placeholder="********"
                   className="input input-bordered w-full bg-neutral-700 placeholder-neutral-500" />
          </div>
        <div className=" py-4">
          <p className="text-neutral-500">
            Don't have an account? <Link to="/signup" className="text-neutral-400 hover:text-neutral-300 transition-all">Signup</Link>
          </p>
        </div>
        <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg  bg-neutral-900 w-full">Login</button>
      </form>
    </>

  )
}
