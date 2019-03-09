import React, { Component } from 'react'
import {  Redirect } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
import picture from '../news.png'
import {toast} from 'react-toastify'
import { UserConsumer} from '../components/contexts/user-context'


class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email : '',
            username: '',
            firstName: '',
            lastName: '',
            password: '',
            errors: []
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit(e) {
        e.preventDefault()
        try {
            let data = await fetch('http://localhost:9999/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        let result = await data.json()
        if(!result.username){
            this.setState({
                errors: result.errors
            })
        }else{
            toast.success(result.message, {
                hideProgressBar: true
              })

              
              localStorage.setItem('isAdmin', result.isAdmin)
              localStorage.setItem('auth_token', result.token)
              localStorage.setItem('username', result.username)
              localStorage.setItem('userId', result.userId)

              const {updateUser} = this.props
              console.log(result.isAdmin)
              updateUser({
                isAdmin: localStorage.getItem('isAdmin'),
                isLoggedIn: true,
                username: result.username,
                userId: result.userId
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

        if(this.state.errors.length){
            this.state.errors.forEach(e => {
                if(e.msg){
                    toast.error(e.msg, {
                        hideProgressBar: true
                      })
                }
                else{
                toast.error(e,{
                    hideProgressBar: true
                })  
            }
                this.setState({
                    errors:[]
                })
            });
            
        }

        return (
            <div className="site-content container mt-4">
            <div className="row">
            <div className="col-sm-6">
            <h1 className="form-header">Register</h1>
            <Form onSubmit={this.handleSubmit}>
                <Form.Row>
                    <Form.Group as={Col} >
                        <Form.Label>First Name</Form.Label>
                        <Form.Control onChange={this.handleChange} id="firstName" placeholder="First Name" />
                    </Form.Group>

                    <Form.Group as={Col} >
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control id="lastName" onChange={this.handleChange} placeholder="Last Name" />
                    </Form.Group>
                </Form.Row>

                <Form.Group >
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" id="email" onChange={this.handleChange} placeholder="Enter email" />
                </Form.Group>

                <Form.Group >
                        <Form.Label>Username</Form.Label>
                        <Form.Control id="username" onChange={this.handleChange} placeholder="Username"/>
                    </Form.Group>

                <Form.Group >
                    <Form.Label>Password</Form.Label>
                    <Form.Control id="password" onChange={this.handleChange}  type="password" placeholder="Password" />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit</Button>
            </Form>
            </div>
            <div className="col-sm-6  ">
            <h1 className="right-header text-center">Your Are The Journalist</h1>
                <img src={picture} style={{width: '90%'}} alt="not found"/>
                <p className="text-justify h4 font-weight-lighter">Sign Up to be able to join the community of the largest developing news site out there!
                 Share what you just saw about the celebrities in your city or make known some new inventor! Just fill in the blank and jump into it!</p>
            </div>
            </div>
            </div>
        )
    }
}

const RegisterWithContext = (props) => {
    return (
        <UserConsumer>
            {
                ({user} ) => (
                    <Register  {...props} isLoggedIn={user.isLoggedIn} updateUser={user.updateUser}/>
                )
            }
        </UserConsumer>
    )
}

export default RegisterWithContext