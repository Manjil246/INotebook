import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {

    let navigate = useNavigate()

    const [detail,setDetail] = useState({email:"",password:""})

    const onChange = (e)=>{
        setDetail({...detail,[e.target.name]:e.target.value})
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response =await fetch("http://localhost:5000/auth/login",{
            method : 'POST',
            headers : {
              'Content-Type':'application/json'
            },
            body:JSON.stringify({"email":detail.email,"password":detail.password})
          });
          const json = await response.json();
          if (json.success){
            //save the auth token and  Redirect
            localStorage.setItem('token',json.authToken)
            navigate("/")
            props.showAlert('success',"Logged In successfully")
          }else{
            if(json.errors[0].msg){
              //Error from express validator...Comes in different format so
              props.showAlert('danger',json.errors[0].msg)
            }
            else{
              //Our giver error
              props.showAlert('danger',json.errors)
            }
          }
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
          <h1>Login To Continue</h1>
            <div className="form-group my-3">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" value={detail.email} onChange={onChange} placeholder="Enter email" autoComplete='off' />
            </div>
            <div className="form-group my-3">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" name='password' placeholder="Password" value={detail.password} onChange={onChange} autoComplete='off'/>
            </div>
            <button type="submit" className="btn btn-primary mx-2" >Submit</button>
        </form>
    </div>
  )
}

export default Login