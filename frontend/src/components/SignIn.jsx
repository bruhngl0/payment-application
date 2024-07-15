import React from 'react'
import axios from 'axios'
import { useState } from 'react'


const SignIn = () => {

  const [loginData, setLogindata] = useState({
    username: "",
    password: "",
  })

  function handleChange(e){
    const {name, value} = e.target
    setLogindata({
     ...loginData,
     [name]: value
    })
   }

   function sendReq(e){
    e.preventDefault()
    sendReqform()
    setLogindata({
      username: "",
      password: ""
    })
    }
   

   async function sendReqform(){
    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
        username: loginData.username,
        password: loginData.password
      })
  
      if(!response){
        alert("no response")
      }
  
      console.log(response.data.id)
      const tokenSignIn = response.data.token
      localStorage.setItem("tokenSignIn", tokenSignIn)



    } catch (error) {
      console.log(error.message)
    }
  }
  

  return (
    <div>
     <h1>SignIn</h1>
     <form onSubmit={sendReq}>
      <input placeholder='username' name= "username" type="text" value={loginData.username} onChange={handleChange}/>
      <input placeholder='password' name= "password" type="text" value={loginData.password} onChange={handleChange}/>
      <button type= "submit">Sign In</button>
     </form>
    </div>
  )
}

export default SignIn
