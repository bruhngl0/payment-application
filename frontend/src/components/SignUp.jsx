import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const SignUp = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")

 


    async function send(){

      try{
      const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
        username,
        password,
        firstname,
        lastname
      })
      if(!response){
        alert("no respose")
      }
      console.log(response.data.message)
      const token = response.data.token
      console.log(token)
      localStorage.setItem("token", token)


    } catch (error) {
      alert(response.json())
    }}
     
    


  return (
    <div>
      <h1>SignUp</h1>
      <form onSubmit={(e)=>{
        e.preventDefault()
        send()
        setFirstname("")
        setLastname("")
        setUsername("")
        setPassword("")
       
        
      }}>





        <input type= "text" placeholder='username' required = {true}  value={username} onChange={(e)=> setUsername(e.target.value)}/>
        <input type= "text" placeholder='password' required = {true}  value={password} onChange={(e)=> setPassword(e.target.value)}/>
        <input type= "text" placeholder='firstname' required = {true}  value={firstname} onChange={(e)=> setFirstname(e.target.value)}/>
        <input type= "text" placeholder='lastname' required = {true}  value={lastname} onChange={(e)=> setLastname(e.target.value)}/>

        <button type= "submit">signUp</button>
      </form>
    </div>
  )
}

export default SignUp
