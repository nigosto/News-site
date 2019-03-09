import React from "react"
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify'
import {UserConsumer} from '../components/contexts/user-context'

class ApproveNews extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            notApproved: []
        }

        this.handleApprove = this.handleApprove.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }

    async handleApprove(e, id) {
        try {
            let data = await fetch(`http://localhost:9999/feed/article/approve/${id}`, {
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

            }
        } catch (error) {
            console.error(error);
        }
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

            }
        } catch (error) {
            console.error(error);
        }
    }

    render(){
        if(this.props.isAdmin !== "true"){
            this.props.history.push('/')
        }

        return(
            <div className="site-content container">
                <h1 className="mt-4 text-center">News To Approve</h1>
                {
                    this.state.notApproved.map(article => (
                        <div className="row mt-4" style={{ border: "1px solid black" }}>
                            <div className="col-sm-2 pt-2 pb-2">
                                <img className="w-100"
                                    style={{ height: "100px" }}
                                    src={article.image}
                                    alt={article.title} />
                            </div>
                            <div className="col-sm-10 pt-2">
                                <h4>{article.title}</h4>
                                <Link className="btn btn-primary btn-sm mt-4 mr-4" to={`/news/preview/${article._id}`}>Preview</Link>
                                <button className="btn btn-success btn-sm mt-4 mr-4" onClick={(e) => this.handleApprove(e,article._id)}>Approve</button>
                                <button className="btn btn-danger btn-sm mt-4 mr-4" onClick={(e) => this.handleDelete(e,article._id)}>Dismiss</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }

    async componentDidMount() {
        let newsAsRequest = await fetch("http://localhost:9999/feed/article/all")
        let newsAsJson = await newsAsRequest.json()
        let news = await newsAsJson.articles.filter(article => article.isApproved === false)
        
        this.setState({
            notApproved: news
        })
    }

    async componentDidUpdate() {
        let newsAsRequest = await fetch("http://localhost:9999/feed/article/all")
        let newsAsJson = await newsAsRequest.json()
        let news = await newsAsJson.articles.filter(article => article.isApproved === false)
        
        this.setState({
            notApproved: news
        })
    }
}

const ApproveNewsWithContext = (props) => {
    return (
        <UserConsumer>
            {
                ({ user }) => (
                    <ApproveNews  {...props} username={user.username} isAdmin={user.isAdmin} isLoggedIn={user.isLoggedIn} />
                )
            }
        </UserConsumer>
    )
}

export default ApproveNewsWithContext