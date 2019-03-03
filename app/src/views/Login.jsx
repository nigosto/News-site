import React, { Component } from 'react'
import {  Redirect } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import {toast} from 'react-toastify'
import {UserConsumer} from '../components/contexts/user-context'

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit(e) {
        e.preventDefault();
        try {
            let data = await fetch('http://localhost:9999/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        let result = await data.json()
        if(!result.username){
            toast.error(result.message, {
                hideProgressBar: true
              })
        }else{
            toast.success(result.message, {
                hideProgressBar: true
              })

              
              localStorage.setItem('isAdmin', result.isAdmin)
              localStorage.setItem('auth_token', result.token)
              localStorage.setItem('username', result.username)

              const {updateUser} = this.props
              console.log(result.isAdmin)
              updateUser({
                isAdmin: localStorage.getItem('isAdmin'),
                isLoggedIn: true,
                username: result.username
            })
        }
        
        } catch (error) {
            console.error(error);
        }
        
    }

    handleChange(e){
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render() {
        if(this.props.isLoggedIn){
            return (
                <Redirect to="/" />
            )
        }

        return (
            <div className="pt-5  site-content container">
            <div className="row">
                <div className="col-md-5">
                    <h1 className="form-header">Login</h1>
                    <Form className="login-form" onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control id="username" onChange={this.handleChange} style={{ width: '300px', height: '50px' }} type="username" placeholder="Enter username" />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.</Form.Text>
                        </Form.Group>
    
                        <Form.Group >
                            <Form.Label>Password</Form.Label>
                            <Form.Control id="password" onChange={this.handleChange} style={{ width: '300px', height: '50px' }} type="password" placeholder="Password" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit</Button>
                    </Form>
                </div>
                <div className="col-md-7">
                <div id="right-header">
                    <h1 >Why Should You Sign In</h1>
                    </div>
                    <div id="right-paragraph">
                        <p className="text-justify h4 font-weight-lighter">You get a lot of privileges when Signing in! Having an account lets you write and send news to our redactors!
                            If they approve that what you sent them is accurate you might see your own news in the site! What is more 
                            being an authorized user you will be able to post comments under other journalists' news and leave either a 
                            like or dislike! So, what are you waiting for? Sign in NOW!
                        </p>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

const LoginWithContext = (props) => {
    return (
        <UserConsumer>
            {
                ({user} ) => (
                    <Login  {...props} isLoggedIn={user.isLoggedIn} updateUser={user.updateUser}/>
                )
            }
        </UserConsumer>
    )
}

export default LoginWithContext