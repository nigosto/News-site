import React, { Component, } from 'react'
import Carousel from '../components/carousel';
import {Link} from 'react-router-dom'

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            recent: [],
            popular: {bodyText: ''},
            other: []
        }
    }

    render() {
        let { popular, other } = this.state
        let text = popular.bodyText.split(' ').slice(0,20).join(' ')
        return (
            <div className="pt-4 site-content container">
                <div className="row">
                    <div className="col-sm-8" >
                        <h1>Recent</h1>
                        <Carousel {...this.props} recent={this.state.recent} />
                    </div>
                    <div className="col-sm-4" style={{height: "400px"}}>
                        <h1>Popular</h1>
                        {
                            popular ?
                                (
                                    <div className="pt-2 pl-2 pr-2" style={{border: "1px solid black"}}>
                                        <img className="w-100 "
                                            style={{ height: "200px" }}
                                            src={popular.image}
                                            alt={popular.title} />
                                        <h4>{popular.title}</h4>
                                        <p>{text}...<br />
                                        <Link to={`/news/details/${popular._id}`}>Read more</Link></p> 
                                    </div>
                                ) : null
                        }
                    </div>
                </div>
                <br />
                <div>
                    <h1>Other news</h1>
                    {
                        other.length ?
                        other.map(article => (
                            <div className="row mt-4" style={{border: "1px solid black"}}>
                                <div className="col-sm-4 pt-2 pb-2">
                                    <img className="w-100"
                                        style={{ height: "200px" }}
                                        src={article.image}
                                        alt={article.title}/>
                                </div>
                                <div className="col-sm-8">
                                    <h4>{article.title}</h4>
                                    <p className="text-justify">{article.bodyText.split(' ').slice(0,80).join(' ')}...<br /><Link to={`/news/details/${article._id}`}>Read more</Link></p>
                                </div>
                            </div>    
                        )): null
                    }
                </div>
            </div>
        )
    }

    async componentDidMount() {
        let newsAsRequest = await fetch("http://localhost:9999/feed/article/all")
        let newsAsJson = await newsAsRequest.json()
        let news = await newsAsJson.articles
        news = news.reverse()
        let recent = news.slice(0, 3)
        news.splice(0, 3)
        let popular = news[0]
        news.splice(0,1)
        let other = news.slice(0,10)
        this.setState({
            recent,
            popular,
            other
        })
    }
}

export default Home