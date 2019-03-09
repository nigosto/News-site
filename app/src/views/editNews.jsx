import React from 'react'
import { UserConsumer } from '../components/contexts/user-context'
import { Form, Button } from 'react-bootstrap'
import CategoryService from '../services/category-service'
import { toast } from 'react-toastify'
import { Redirect } from 'react-router-dom'

class EditNews extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            id: '',
            title: '',
            information: '',
            isLoading: true,
            isAuthor: false,
            error: false,
            isApproved: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit(e) {
        e.preventDefault()
        console.log(this.state)

        try {
            let data = await fetch(`http://localhost:9999/feed/article/edit/${this.state.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
                },
                body: JSON.stringify({ title: this.state.title, information: this.state.information })
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

                this.props.history.push(`/news/approve`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render() {
        const { title, information, isAuthor } = this.state
        if(this.state.isLoading){
            return (
                <span>Loading...</span>
            )
        }
        if(this.state.error){
            return(
                <Redirect to="/not-found" />
            )
        }
        
        if(this.props.isAdmin === "true" || (isAuthor == true && this.state.isApproved === true)){
        return (
            <div className="site-content container text-center">
                <h1 className="mt-4">Edit News</h1>
                <div className="row">
                    <div className="col-sm-3"></div>
                    <Form className="col-sm-6 mt-2 mb-4" onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <Form.Group >
                            <Form.Label className="h3">Title</Form.Label>
                            <Form.Control onChange={this.handleChange} id="title" value={title} />
                        </Form.Group>


                        <Form.Group >
                            <Form.Label className="h3">Information</Form.Label>
                            <Form.Control onChange={this.handleChange} value={information} id="information" as="textarea" rows="3" style={{ height: 400 }} />
                        </Form.Group>

                        <Button variant="primary" className="mt-3" type="submit">Submit</Button>
                    </Form>
                </div>
            </div>
        )
        }
        else{
            return (
                <Redirect to="/" />
            )
        }
    }

    async componentDidMount() {
        this.setState({
            isLoading: true
        }, async () => {
            fetch(`http://localhost:9999/feed/article/${this.props.match.params.id}`)
                .then(res => res.json())
                .then(body => body.article)
                .then(news => {
                    if(news===undefined){
                        this.props.history.push('/')
                    }
                    this.setState({
                        isApproved: news.isApproved,
                        id: news._id,
                        isAuthor: this.props.userId == news.author._id,
                        title: news.title,
                        information: news.bodyText,
                        isLoading: false
                    })
                })
                .catch(err => console.log(err))
        })

    }
}


const EditNewsPageWithContext = (props) => {
    return (
        <UserConsumer>
            {
                ({ user }) => (
                    <EditNews  {...props} userId={user.userId} username={user.username} isAdmin={user.isAdmin} isLoggedIn={user.isLoggedIn} />
                )
            }
        </UserConsumer>
    )
}

export default EditNewsPageWithContext