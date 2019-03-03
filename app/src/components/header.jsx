import React from 'react'
import { NavDropdown, } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { UserConsumer } from './contexts/user-context'

class Header extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            categories: []
        }
    }

    render() {
        const { isAdmin, isLoggedIn, username } = this.props;
        console.log(isAdmin)

        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg navbar-dark bg-info w-100 py-4" style={{ height: "0px" }}>
                    <NavLink className="navbar-brand" to="#" >Daily News</NavLink>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/" exact>Home </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/aaa" exact>Link</NavLink>
                            </li>

                            <NavDropdown title="Categories" id="basic-nav-dropdown" >
                                {
                                    this.state.categories.length ?
                                        this.state.categories.map(category => (
                                            <NavLink style={{ textDecoration: 'none', color: 'black' }} className="nav-dropdown" to={`/category/${category.name}`} exact key={category._id}>{category.name}</NavLink>
                                        )) : null
                                }
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </ul>

                        <ul className="navbar-nav mr-2" >
                            <li className="nav-item">
                                <form className="form-inline mr-3 my-2 my-lg-0">
                                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                    <button className="btn btn-outline-dark my-2 my-sm-0" type="submit">Search</button>
                                </form>
                            </li>
                            {
                                isLoggedIn ?
                                    (
                                        <React.Fragment>
                                            <li className="nav-item">
                                                <a className="navbar-text" style={{ color: 'white' }}>
                                                    Welocome, {username}
                                                </a>
                                            </li>
                                            {
                                                isAdmin === "true" ? (
                                                    <li className="nav-item">
                                                        <NavLink className="nav-link" to="/manage/category" exact>Manage Categories</NavLink>
                                                    </li>
                                                ) : (
                                                        <li className="nav-item">
                                                            <NavLink className="nav-link" to="/news/send" exact>Send News</NavLink>
                                                        </li>
                                                    )
                                            }
                                            <li className="nav-item">
                                                <NavLink className="nav-link" to="#" onClick={(e) => { e.preventDefault(); localStorage.clear(); window.location.href = "/login" }} exact>
                                                    Logout
                                                </NavLink>
                                            </li>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <li className="nav-item">
                                                <NavLink className="nav-link" to="/login" exact>Login</NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink className="nav-link" to="/register" exact>Register</NavLink>
                                            </li>
                                        </React.Fragment>
                                    )
                            }
                        </ul>
                    </div>
                </nav>
            </React.Fragment>
        )
    }

    async componentDidMount() {
        let categoriesRequest = await fetch("http://localhost:9999/feed/category/all")
        let categoriesAsJson = await categoriesRequest.json()
        let categories = await categoriesAsJson.categories

        this.setState({
            categories
        })
    }
}

const HeaderWithContext = (props) => {
    return (
        <UserConsumer>
            {
                ({ user }) => (
                    <Header  {...props} isLoggedIn={user.isLoggedIn} username={user.username} isAdmin={user.isAdmin} />
                )
            }
        </UserConsumer>
    )
}

export default HeaderWithContext