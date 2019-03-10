import React, { Component,  } from 'react'
import { Redirect, Link } from 'react-router-dom'

class Category extends Component {
    constructor(props) {
        super(props)

        this.state = {
            articles: [],
            error: false,
            location: window.location.pathname,
            isLoading: false
        }
    }

    render() {
        if(this.state.error){
            return(
                <Redirect to="/not-found" />
            )
        }

        if(this.state.location !== window.location.pathname){
            window.location.reload()
        }

        if(this.state.isLoading){
            return(
            <span>Loading...</span>
            )
        }

        return (
            <div className="site-content container">
            <h1 className="mt-2">{this.props.match.params.name}</h1>
                {
                    this.state.articles.length ?
                        this.state.articles.map(article => (
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
                        )) : <p className="h3 mt-4">No news in this category</p>
                }
            </div>
        )
    }

    async componentDidMount() {
        try {
            this.setState({
                isLoading: true
            }, async () => {
                let categoriesRequest = await fetch(`http://localhost:9999/feed/category/articles/${this.props.match.params.name}`)
                let articlesAsJson = await categoriesRequest.json()
                let articles = await articlesAsJson.articles.filter(article => article.isApproved === true)
    
                if(articlesAsJson.error){
                    this.setState({
                        error: true
                    })
                    return null
                }
    
                this.setState({
                    articles,
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

export default Category
