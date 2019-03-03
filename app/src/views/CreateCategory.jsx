import React, {Component} from 'react'
import {UserConsumer} from '../components/contexts/user-context'
import {Redirect} from 'react-router-dom'

class CategoryForm extends Component {
    render() {
        if(this.props.isAdmin !== "true"){
            return (
                <Redirect to="/" />
            )
        }

        return (
            <div className="site-content"></div>
        )
    }
}

const CategoryFormWithContext = (props) => {
    return (
        <UserConsumer>
            {
                ({user} ) => (
                    <CategoryForm  {...props} isAdmin={user.isAdmin} />
                )
            }
        </UserConsumer>
    )
}

export default CategoryFormWithContext