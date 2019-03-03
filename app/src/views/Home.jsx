import React, { Component,  } from 'react'
import Carousel from '../components/carousel';


class Home extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="pt-4 site-content container">
            <div className="row">
            <div className="col-sm-8">
            <h1>Recent</h1>
                <Carousel />
                </div>
                <div className="col-sm-4">
                <h1>Popular</h1>
                <p  className="text-justify h4 font-weight-lighter">
                    You get a lot of privileges when Signing in! Having an account lets you write and send news to our redactors!
                            If they approve that what you sent them is accurate you might see your own news in the site! What is more 
                            being an authorized user you will be able to post comments under other journalists' news and leave either a 
                            like or dislike! So, what are you waiting for? Sign in NOW!
                    </p>
                </div>
            </div>
                <br />
                <div>
                    <h1>Other news</h1>
                    <p>
                    You get a lot of privileges when Signing in! Having an account lets you write and send news to our redactors!
                            If they approve that what you sent them is accurate you might see your own news in the site! What is more 
                            being an authorized user you will be able to post comments under other journalists' news and leave either a 
                            like or dislike! So, what are you waiting for? Sign in NOW!
                    </p>
                </div>
            </div>
        )
    }
}

export default Home