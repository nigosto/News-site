import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Form, Button } from 'react-bootstrap'

class CategoryForm extends Component {
    constructor(props){
        super(props)

        this.state = {
            name: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit(e) {
        e.preventDefault()
        try {
            let data = await fetch(`http://localhost:9999/feed/category/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
                },
                body: JSON.stringify({ name: this.state.name })
            })
            let result = await data.json()
            if (!result.category) {
                toast.error("Category already exists", {
                    hideProgressBar: true
                })
            }
            else {
                toast.success(result.message, {
                    hideProgressBar: true
                })

                this.setState({
                    name: ''
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
        return (
            <React.Fragment>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group>
                        <h1>Create Category</h1>
                        <Form.Control id="name" onChange={this.handleChange} value={this.state.name} className="mt-4" placeholder="Enter category name" />
                    </Form.Group>
                    <Button variant="primary" className="mt-3 mb-5" type="submit">
                    Submit
                    </Button>
                </Form>
                </React.Fragment>
        )
    }
}


export default CategoryForm