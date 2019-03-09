import React from 'react'
import { UserConsumer } from '../components/contexts/user-context'
import { Redirect, Link } from 'react-router-dom'

class Preview extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            error: false,
            isLoading: false,
            news: { author: { _id: '' } }
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



        if (this.state.news.isApproved === true) {
            return (
                <Redirect to="/not-found" />
            )
        }

        const { news } = this.state
        console.log(this.props.userId)
        console.log(news.author._id)
        if (this.props.isAdmin === "true" || (this.props.userId == news.author._id)) {

            let author = news.author
            console.log(news.bodyText)
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
                                    <div className="text-center mt-3">
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-sm-1"></div>
                                        <p className="mt-4 col-sm-9 ml-5" style={{ whiteSpace: "pre-line", fontSize: "18px" }}>{news.bodyText}</p>
                                    </div>
                                </div>
                            ) : null
                    }
                </div>
            )
        } else {
            return (
                <Redirect to="/" />
            )
        }
    }

    async componentWillMount() {
        try {
            this.setState({
                isLoading: true
            }, async () => {
                fetch(`http://localhost:9999/feed/article/${this.props.match.params.id}`)
                    .then(res => res.json())
                    .then(body => body.article)
                    .then(news => {

                        console.log(news)
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
                    .catch(err => console.log(err))
            })

        } catch (e) {
            this.setState({
                error: true
            })
        }
    }
}

const PreviewWithContext = (props) => {
    return (
        <UserConsumer>
            {
                ({ user }) => (
                    <Preview  {...props} userId={user.userId} username={user.username} isAdmin={user.isAdmin} isLoggedIn={user.isLoggedIn} />
                )
            }
        </UserConsumer>
    )
}

export default PreviewWithContext