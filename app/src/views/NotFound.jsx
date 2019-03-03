import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import '../NotFound.css'

class NotFound extends Component{
    render(){
        return (
            <div className="site-content">
            <h1 className="not-found-header">404 Not found</h1>
            <p className="not-found-paragraph">Return to <Link to="/" onClick={() => window.notFound = false} >Home</Link></p>
            </div>
        )
    }
}

export default NotFound