import React, { Component } from 'react'
import { UserConsumer } from '../components/contexts/user-context'
import { Redirect } from 'react-router-dom'
import CategoryForm from '../components/categoryForm';
import { Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import withUserContext from '../components/hocs/withUserContext'

class CategoryManagePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            categories: [],
            isBeingRenamed: false,
            categoryToBeRenamed: '',
            newName: '',
            hasChanged: false
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }

    handleChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleClick(e) {
        this.setState({
            isBeingRenamed: true,
            categoryToBeRenamed: e.target.id
        })
    }

    async handleDelete(e){
        const category = e.target.id;
        try {
            let data = await fetch(`http://localhost:9999/feed/category/delete/${category}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
                }
            })
            let result = await data.json()
            
                toast.success(result.message, {
                    hideProgressBar: true
                })

                this.setState({
                    hasChanged: true,
                    isBeingRenamed: false,
                    categoryToBeRenamed: '',
                    newName: ''
                })
            
        } catch (error) {
            console.error(error);
        }
    }

    async handleSubmit(e) {
        e.preventDefault()
        try {
            let data = await fetch(`http://localhost:9999/feed/category/rename/${this.state.categoryToBeRenamed}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
                },
                body: JSON.stringify({ newName: this.state.newName })
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
                    hasChanged: true,
                    isBeingRenamed: false,
                    categoryToBeRenamed: '',
                    newName: ''
                })
            }
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        if (this.props.isAdmin !== "true") {
            return (
                <Redirect to="/" />
            )
        }

        return (

            <div className="site-content container">
                <div className="row mt-4">
                    <div className="col-sm-4">
                        <CategoryForm />
                        {
                            this.state.isBeingRenamed === true ?
                                (<div className="mt-5">
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group>
                                            <h1>Rename: {
                                                this.state.categories.filter(c => {
                                                    return c._id === this.state.categoryToBeRenamed
                                                })[0].name
                                            }</h1>
                                            <Form.Control id="newName" onChange={this.handleChange} className="mt-4" placeholder="Enter new name" />
                                        </Form.Group>
                                        <Button variant="primary" className="mt-3 mb-5" type="submit">
                                            Submit
                                        </Button>
                                    </Form>

                                </div>) : null
                        }
                    </div>
                    <div className="col-sm-2"></div>
                    <div className="col-sm-5">
                        <h1 className="text-center">All Categories</h1>
                        <div>
                            {
                                this.state.categories.length ?
                                    this.state.categories.map(category => (
                                        <div key={category._id} className="row">
                                            <h3 className="mt-4 col-sm-3">{category.name}</h3>
                                            <div className="col-sm-9">
                                                <button id={category._id} onClick={this.handleClick} className="btn btn-secondary mt-4 ml-5 text-white" type="button">Rename</button>
                                                <button id={category._id} onClick={this.handleDelete} className="btn btn-danger mt-4 ml-3" type="button">Delete</button>
                                            </div>
                                        </div>
                                    )) : <p>No categories available</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    async componentDidMount() {
        let categoriesRequest = await fetch("http://localhost:9999/feed/category/all")
        let categoriesAsJson = await categoriesRequest.json()
        let categories = await categoriesAsJson.categories

        this.setState({
            categories
        })
    }

    async componentDidUpdate() {
        let categoriesRequest = await fetch("http://localhost:9999/feed/category/all")
        let categoriesAsJson = await categoriesRequest.json()
        let categories = await categoriesAsJson.categories

        this.setState({
            categories
        })
    }
}

export default withUserContext(CategoryManagePage)