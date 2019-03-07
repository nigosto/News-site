import React, { Component } from "react";
import { Carousel } from 'react-bootstrap'

export default class SimpleSlider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            redirect: false,
            route: ''
        }
    }

    handleRedirect(e, route){
        e.preventDefault(); 
        this.setState({
            redirect: true,
            route
        })
    }

    render() {
        
        if(this.state.redirect){
            this.props.history.push(this.state.route)
        }

        return (
                <div  className="pt-2 pl-2 pr-2 pb-2" style={{border: "1px solid black"}}>
                <Carousel interval={3000} pauseOnHover={false}>
                {
                    this.props.recent.length ?
                    this.props.recent.map(article => (
                        <Carousel.Item key={article._id}>
                        <img
                            className="d-block w-100 img"
                            src={article.image}
                            alt={article.title}
                            onClick={ (e) => this.handleRedirect(e,`/news/details/${article._id}`)}
                        />
                        <Carousel.Caption style={{backgroundColor: '#404040', width: '70%'}}>
                            <h3>{article.title}</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                    )) : null
                }
                
                </Carousel>
                </div>
        );
    }
}