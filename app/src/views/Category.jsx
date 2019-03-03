import React, { Component,  } from 'react'
import { Redirect } from 'react-router-dom'

class Category extends Component {
    constructor(props) {
        super(props)

        this.state = {
            articles: [],
            error: false
        }
    }

    render() {
        if(this.state.error){
            return(
                <Redirect to="/not-found" />
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
                articles
            })
        } catch (e) {
            this.setState({
                error: true
            })
        }

    }
}

export default Category