import React, { Component, Fragment } from 'react'
import { UserConsumer } from '../components/contexts/user-context'
import { Redirect } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import CategoryService from '../services/category-service'
import { toast } from 'react-toastify'

class CreateArticle extends Component {
    constructor(props) {
        super(props)

        this.state = {
            categories: [],
            title: '',
            image: undefined,
            video: '',
            category: '',
            information: '',
            author: this.props.username,
            label: "Choose image"
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInputFileChange = this.handleInputFileChange.bind(this)
    }

    static service = new CategoryService()

    handleChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleInputFileChange(e) {
        let file = e.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file);
        reader.onload = async (e) => {
            this.setState({
                image:e.target.result,
                label: file.name
            })    
        }
        
    }

    async handleSubmit(e) {
        e.preventDefault()
        //console.log(this.state)

        try {
            let data = await fetch('http://localhost:9999/feed/article/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
            },
            body: JSON.stringify(this.state)
        })
        let result = await data.json()
        if (result.errors) {
            result.errors.forEach(e => toast.error(e, {
                hideProgressBar: true
            }))
            
        }
        else {
            toast.success(result.message, {
                hideProgressBar: true
            })

            this.props.history.push('/');
        }
        } catch (error) {
            console.error(error);
        }
       
    }

    render() {
        if ((this.props.isLoggedIn === false) || this.props.isAdmin === "true") {
            return (
                <Redirect to="/login" />
            )
        }

        return (
            <div className="site-content container text-center">
                <h1 className="mt-4">Send News</h1>
                <div className="row">
                    <div className="col-sm-3"></div>
                    <Form className="col-sm-6 mt-2 mb-4" onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <Form.Group >
                            <Form.Label className="h3">Title</Form.Label>
                            <Form.Control onChange={this.handleChange} id="title" placeholder="Enter title" />
                        </Form.Group>
                        <Form.Group >
                             <Form.Label className="h3">Image</Form.Label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                </div>
                                <div className="custom-file">
                                    <input
                                        type="file"
                                        className="custom-file-input"
                                        id="image"
                                        onChange={this.handleInputFileChange}
                                        aria-describedby="inputGroupFileAddon01"
                                    />
                                    <label className="custom-file-label text-left text-secondary" htmlFor="image">{this.state.label}</label>
                                </div>
                            </div>
                        </Form.Group>
                        {/* <Form.Group >
                            <Form.Label className="h3">Video</Form.Label>
                            <Form.Control onChange={this.handleChange} id="video" placeholder="Enter video address" />
                            <Form.Text className="text-muted">Video is Optional</Form.Text>
                        </Form.Group> */}
                        <Form.Group >
                            <Form.Label className="h3">Information</Form.Label>
                            <Form.Control onChange={this.handleChange} id="information" as="textarea" rows="3" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="h3">Category</Form.Label>
                            <Form.Control onChange={this.handleChange} id="category" as="select">
                                <option>Choose category</option>
                                {
                                    this.state.categories.length ?
                                        this.state.categories.map(category => (
                                            <option key={category._id} value={category._id}>{category.name}</option>
                                        )) : null
                                }
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" className="mt-3" type="submit">Submit</Button>
                    </Form>
                </div>
            </div>
        )
    }

    async componentDidMount() {
        try {
            const categories = await CreateArticle.service.getAllCategories()
            //console.log(categories)
            this.setState({
                categories
            })
        } catch (error) {
            console.error(error)
        }
    }
}

const CreateArticleWithContext = (props) => {
    return (
        <UserConsumer>
            {
                ({ user }) => (
                    <CreateArticle  {...props} username={user.username} isAdmin={user.isAdmin} isLoggedIn={user.isLoggedIn} />
                )
            }
        </UserConsumer>
    )
}

export default CreateArticleWithContext