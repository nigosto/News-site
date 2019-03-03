import React, {Component, Fragment} from 'react'
import {UserConsumer} from '../components/contexts/user-context'
import {  Redirect } from 'react-router-dom'

class ArticleForm extends Component {
    constructor(props){
        super(props)
    }

    render() {
        if((this.props.isLoggedIn === false) || this.props.isAdmin === "true"){
            return (
                <Redirect to="/login" />
            )
        }

        return (
            <div className="site-content"></div>
        )
    }
}

const ArticleFormrWithContext = (props) => {
    return (
        <UserConsumer>
            {
                ({user} ) => (
                    <ArticleForm  {...props} isAdmin={user.isAdmin} isLoggedIn={user.isLoggedIn}/>
                )
            }
        </UserConsumer>
    )
}

export default ArticleFormrWithContext