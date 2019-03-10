import React from 'react'
import { UserConsumer } from '../components/contexts/user-context'
import { toast } from 'react-toastify'
import { Redirect, Link } from 'react-router-dom'
import withUserContext from '../components/hocs/withUserContext'

class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {
                articles: []
            }
        }

        this.handleDelete = this.handleDelete.bind(this)
    }

    async handleDelete(e, id){
        try {
            let data = await fetch(`http://localhost:9999/feed/article/remove/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
                }
            })
            let result = await data.json()
            if (!result.news) {
                toast.error("Category already exists", {
                    hideProgressBar: true
                })
            }
            else {
                toast.success(result.message, {
                    hideProgressBar: true
                })

                this.props.history.push('/')
            }
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { user } = this.state
        if ((this.props.isLoggedIn === false) || this.props.isAdmin === "true" || this.props.username !== this.props.match.params.username) {
            return (
                <Redirect to="/login" />
            )
        }

        return (
            <div className="site-content container">
                <h1 className="text-center mt-4">{user.firstName} {user.lastName}</h1>
                <div className="row">
                    <div className="col-sm-6">
                        <h2 className="mt-3 mb-4">Approved News:</h2>
                        {
                            user.articles.filter(news => news.isApproved === true).length ? (
                                user.articles.filter(news => news.isApproved === true).map(news => (
                                    <div className="row mt-4" >
                                        <div className="col-sm-6 pt-2 pb-2">
                                            <img className="w-100"
                                                style={{ height: "150px" }}
                                                src={news.image}
                                                alt={news.title} />
                                        </div>
                                        <div className="col-sm-5 pt-2">
                                            <h4>{news.title}</h4>
                                            <Link className="btn btn-primary btn-sm mr-3 mb-2" to={`/news/details/${news._id}`}>View</Link>
                                            <Link className="btn btn-warning btn-sm mr-3 mb-2" to={`/news/edit/${news._id}`}>Edit</Link>
                                            <button className="btn btn-danger btn-sm mr-4 mb-2" onClick={(e) => this.handleDelete(e, news._id)}>Delete</button>
                                        </div>
                                    </div>
                                ))
                            ) : <p className="h4">You have no approved news</p>
                        }
                    </div>
                    <div className="col-sm-6">
                        <h2 className="mt-3 mb-4">Pending News:</h2>
                        {
                            user.articles.filter(news => news.isApproved === false).length ? (
                                user.articles.filter(news => news.isApproved === false).map(news => (
                                    <div className="row mt-4" >
                                        <div className="col-sm-6 pt-2 pb-2">
                                            <img className="w-100"
                                                style={{ height: "150px" }}
                                                src={news.image}
                                                alt={news.title} />
                                        </div>
                                        <div className="col-sm-5 pt-2">
                                            <h4>{news.title}</h4>
                                            <Link className="btn btn-primary btn-sm mr-3 mb-2" to={`/news/preview/${news._id}`}>Preview</Link>
                                        </div>
                                    </div>
                                ))
                            ) : <p className="h4">You have no pending news</p>
                        }
                    </div>
                </div>
            </div>
        )
    }

    async componentDidMount() {
        try {
            this.setState({
                isLoading: true
            }, async () => {
                let userRequest = await fetch(`http://localhost:9999/feed/user/profile/${this.props.match.params.username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
                    }
                })
                let userAsJson = await userRequest.json()
                let user = await userAsJson.user

                this.setState({
                    user
                })
            })

        } catch (e) {
            console.log(e)
        }
    }

    
}

export default withUserContext(Profile);