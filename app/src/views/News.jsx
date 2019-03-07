import React from 'react'
import {Redirect} from 'react-router-dom'

class News extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            error: false,
            isLoading: false,
            news: {author: {}}
        }
    }

    render() {

        if(this.state.error){
            return(
                <Redirect to="/not-found" />
            )
        }

        if(this.state.isLoading){
            return(
            <span>Loading...</span>
            )
        }

        const {news} = this.state
        let author = news.author
        console.log(news.bodyText)
        let creationDate = new Date(news.creationDate)
        let date = creationDate.getDate()
        let month = creationDate.getMonth() + 1
        let year = creationDate.getFullYear()
        if(date/10<1){
            date = "0" + date
        }
        if(month/10<1){
            month = "0" + month
        }
        return (
            <div className="site-content container">
            {
                news ?
                (
                    <div>
                        <h1 className="mt-4 text-center mb-3">{news.title}</h1>
                        <div className="row" style={{fontSize: "20px"}}>
                        <p className="col-sm-4 text-right mt-3" >{`${date}-${month}-${year}`}</p>
                        <p className="col-sm-5 text-right mt-3">by {author.username}</p>
                        </div>
                        <img className="d-block img-center mt-3"
                            src={news.image}
                            alt={news.title}
                        />
                        <div className="row mt-3">
                        <div className="col-sm-1"></div>
                        <p className="mt-4 col-sm-9 ml-5" style={{ whiteSpace: "pre-line"}}>{news.bodyText}</p>
                        </div>
                    </div>
                ): null
            }
            </div>
        )
    }

    async componentDidMount(){
        try {
            this.setState({
                isLoading: true
            }, async () => {
                let newsRequest = await fetch(`http://localhost:9999/feed/article/${this.props.match.params.id}`)
                let newsAsJson = await newsRequest.json()
                let news = await newsAsJson.article
                if(!news){
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

export default News