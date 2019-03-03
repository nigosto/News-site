import React, { Component,  } from 'react'
import { Redirect } from 'react-router-dom'

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
            <div className="site-content">
                {
                    this.state.articles.length ?
                        this.state.articles.map(article => (
                            <p>{article.title}</p>
                        )) : null
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
                let articles = await articlesAsJson.articles
    
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