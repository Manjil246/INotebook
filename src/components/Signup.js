import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {

  let navigate = useNavigate()
    const [detail,setDetail] = useState({name:"",email:"",password:"",cpassword:""})

    const onChange = (e)=>{
        setDetail({...detail,[e.target.name]:e.target.value})
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(detail.password===detail.cpassword){
          const response =await fetch("http://localhost:5000/auth/createuser",{
            method : 'POST',
            headers : {
              'Content-Type':'application/json'
            },
            body:JSON.stringify({"name":detail.name,"email":detail.email,"password":detail.password})
          });
          const json = await response.json();
          console.log(json)
          if (json.success){
            //save the auth token and  Redirect
            localStorage.setItem('token',json.authToken)
            alert('Account Created Successfully')
            navigate("/")
            props.showAlert('success',"Account Created Successfully")
          }else{
            props.showAlert('danger',json.errors)
          }
        }
        else{
          props.showAlert('danger','Passwords Dont match')
        }
    }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>SignUp To Continue with iNotebook</h1>
        <div className="form-group my-3">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" name='name' aria-describedby="emailHelp" value={detail.name} onChange={onChange} placeholder="Enter name"   minLength={5} required/>
        </div>
        <div className="form-group my-3">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" value={detail.email} onChange={onChange} placeholder="Enter email" minLength={5} required/>
        </div>
        <div className="form-group my-3">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" name='password' value={detail.password} onChange={onChange} placeholder="Password" minLength={5} required/>
        </div>
        <div className="form-group my-3">
          <label htmlFor="cpassword">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword' value={detail.cpassword} onChange={onChange} placeholder="Password" minLength={5} required/>
        </div>
        <button type="submit" className="btn btn-primary my-3">Submit</button>
      </form>
    </div>
  )
}

export default Signup