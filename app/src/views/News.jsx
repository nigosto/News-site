import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { UserConsumer } from '../components/contexts/user-context'
import { toast } from 'react-toastify'
import withUserContext from '../components/hocs/withUserContext'

class News extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            error: false,
            isLoading: false,
            news: { author: {}, comments: [] },
            comment: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    async handleSubmit(e) {
        e.preventDefault()
        console.log(this.state.comment)

        try {
            let data = await fetch('http://localhost:9999/feed/comment/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
                },
                body: JSON.stringify({
                    bodyText: this.state.comment,
                    author: this.props.userId,
                    article: this.state.news._id
                })
            })
            let result = await data.json()

            if(result.error){
                toast.error(result.error, {
                    hideProgressBar: true
                })
            }
            else{
            toast.success(result.message, {
                hideProgressBar: true
            })

            try {
                this.setState({
                    isLoading: true
                }, async () => {
                    let newsRequest = await fetch(`http://localhost:9999/feed/article/${this.props.match.params.id}`)
                    let newsAsJson = await newsRequest.json()
                    let news = await newsAsJson.article
                    if (!news) {
                        this.setState({
                            error: true
                        })
                        return null
                    }

                    this.setState({
                        news,
                        isLoading: false
                    })
                })

            } catch (e) {
                this.setState({
                    error: true
                })
            }
        }

        } catch (error) {
            console.error(error);
        }
    }

    render() {

        if (this.state.error) {
            return (
                <Redirect to="/not-found" />
            )
        }

        if (this.state.isLoading) {
            return (
                <span>Loading...</span>
            )
        }

        if (this.state.news.isApproved === false) {
            return (
                <Redirect to="/not-found" />
            )
        }

        const { news } = this.state
        let author = news.author
        let creationDate = new Date(news.creationDate)
        let date = creationDate.getDate()
        let month = creationDate.getMonth() + 1
        let year = creationDate.getFullYear()
        if (date / 10 < 1) {
            date = "0" + date
        }
        if (month / 10 < 1) {
            month = "0" + month
        }
        return (
            <div className="site-content container">
                {
                    news ?
                        (
                            <div>
                                <h1 className="mt-4 text-center mb-3">{news.title}</h1>
                                <div className="row" style={{ fontSize: "20px" }}>
                                <div className="col-sm-4 text-right mt-3"><p>{`${date}-${month}-${year}`}</p></div>
                                        <div className="col-sm-4 text-center">
                                            {
                                                this.props.isAdmin === "true" ? (
                                                    <Link className="btn btn-warning btn-lg btn-block" to={`/news/edit/${news._id}`}>Edit</Link>
                                                ) : null
                                            }

                                        </div>
                                        <div className=" col-sm-4 mt-3">
                                            <p>by {author.username}</p>
                                        </div>
                                </div>
                                <img className="d-block img-center mt-3"
                                    src={news.image}
                                    alt={news.title}
                                />
                                <div className="row mt-3">
                                    <div className="col-sm-1"></div>
                                    <p className="mt-4 col-sm-9 ml-5" style={{ whiteSpace: "pre-line", fontSize: "18px" }}>{news.bodyText}</p>
                                </div>
                            </div>
                        ) : null
                }
                {
                    this.props.isLoggedIn ? (
                        <Form className="mt-3" onSubmit={this.handleSubmit}>
                            <Form.Group >
                                <Form.Label className="h3">Add comment: </Form.Label>
                                <Form.Control onChange={this.handleChange} id="comment" as="textarea" rows="3" />
                            </Form.Group>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                    ) : null
                }

                <div className="mt-5">
                    <h1>Comments</h1>
                    {
                        news.comments.length ?
                            news.comments.map(c => (
                                <div className="mt-5" >
                                    <p style={{ fontSize: 23 }} className="mt-3"><span className="h4 mr-3">{c.author.username} ({c.author.firstName} {c.author.lastName}):</span> {c.bodyText}</p>
                                </div>
                            )) : <span>No comments</span>
                    }
                </div>
            </div>
        )
    }

    async componentDidMount() {
        try {
            this.setState({
                isLoading: true
            }, async () => {
                let newsRequest = await fetch(`http://localhost:9999/feed/article/${this.props.match.params.id}`)
                let newsAsJson = await newsRequest.json()
                let news = await newsAsJson.article
                if (!news) {
                    this.setState({
                        error: true
                    })
                    return null
                }

                this.setState({
                    news,
                    isLoading: false
                })
            })

        } catch (e) {
            this.setState({
                error: true
            })
        }
    }

    
}

export default withUserContext(News)