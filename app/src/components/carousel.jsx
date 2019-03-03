import React, { Component } from "react";
import { Carousel } from 'react-bootstrap'

export default class SimpleSlider extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        return (

                <Carousel interval={3000} pauseOnHover={false}>
                    <Carousel.Item>
                        <img
                            className="d-block w-100 img"
                            src="http://jewel1067.com/wp-content/uploads/news.jpg"
                            alt="First slide"
                        />
                        <Carousel.Caption style={{backgroundColor: '#404040', width: '70%'}}>
                            <h3>First slide label</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100 img"
                            src="http://jewel1067.com/wp-content/uploads/news.jpg"
                            alt="Third slide"
                        />

                        <Carousel.Caption style={{backgroundColor: '#404040', width: '70%'}}>
                            <h3>Second slide label</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100 img"
                            src="https://ichef.bbci.co.uk/news/640/media/images/48351000/gif/_48351569_640x360-news.gif"
                            alt="Third slide"
                        />

                        <Carousel.Caption style={{backgroundColor: '#404040', width: '70%'}}>
                            <h3>Third slide label</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
                
        );
    }
}