import React, { Component, } from 'react'
import Carousel from '../components/carousel';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'


class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            recent: [],
            popular: { bodyText: '' },
            other: []
        }

        this.handleDelete = this.handleDelete.bind(this)
    }

    async handleDelete(e, id) {
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
        let { popular, other, recent } = this.state
        let text = popular ? popular.bodyText.split(' ').slice(0, 25).join(' ') : null
        return (
            <div className="pt-4 site-content container">
                {
                    recent.length ? (
                        <React.Fragment>
                            <div className="row">
                                <div className="col-sm-8" >
                                    <h1>Recent</h1>
                                    <Carousel {...this.props} recent={this.state.recent} />
                                </div>
                                <div className="col-sm-4" style={{ height: "400px" }}>

                                    {
                                        popular ?
                                            (
                                                <React.Fragment>
                                                    <h1>Popular</h1>
                                                    <div className="pt-2 pl-2 pr-2" style={{ border: "1px solid black" }}>
                                                        <img className="w-100 "
                                                            style={{ height: "200px" }}
                                                            src={popular.image}
                                                            alt={popular.title} />
                                                        <h4>{popular.title}</h4>
                                                        <p>{text}...<br />
                                                            <Link to={`/news/details/${popular._id}`}>Read more</Link>
                                                        </p>

                                                    </div>
                                                </React.Fragment>
                                            ) : null
                                    }
                                </div>
                            </div>
                            <br />
                            {
                                other.length ? (
                                    <div>
                                        <h1>Other news</h1>
                                        {
                                            other.map(article => (
                                                <div key={article._id} className="row mt-4" style={{ border: "1px solid black" }}>
                                                    <div className="col-sm-4 pt-2 pb-2">
                                                        <img className="w-100"
                                                            style={{ height: "200px" }}
                                                            src={article.image}
                                                            alt={article.title} />
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <h4>{article.title}</h4>
                                                        <p className="text-justify">{article.bodyText.split(' ').slice(0, 80).join(' ')}...<br /><Link to={`/news/details/${article._id}`}>Read more</Link></p>
                                                    </div>
                                                </div>
                                            ))
                                        }</div>) : null
                            }
                        </React.Fragment>
                    ) : <p className="h3 mt-4 text-center">No news available</p>
                }


            </div>
        )
    }

    async componentDidMount() {
        let newsAsRequest = await fetch("http://localhost:9999/feed/article/all")
        let newsAsJson = await newsAsRequest.json()
        let news = await newsAsJson.articles.filter(article => article.isApproved === true)
        news = news.reverse()
        let recent = news.slice(0, 3)
        news.splice(0, 3)
        let popular = news[0]
        news.splice(0, 1)
        let other = news.slice(0, 10)
        this.setState({
            recent,
            popular,
            other
        })
    }
}

export default Home