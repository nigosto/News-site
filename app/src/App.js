import React, { Component } from 'react';
import './App.css';
import Header from './components/header';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import NotFound from './views/notFound'
import Category from './views/Category';
import Login from './views/Login';
import Footer from './components/footer';
import Register from './views/Register';
import Home from './views/Home';
import { ToastContainer } from 'react-toastify'
import { UserProvider } from './components/contexts/user-context';
import CreateArticle from './views/CreateArticle';
import CategoryManagePage from './views/CreateCategory'
import News from './views/News';
import ApproveNews from './views/approveNews';
import Preview from './views/preview'
import EditNews from './views/editNews'
import Profile from './views/profile';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {
        isLoggedIn: localStorage.getItem("auth_token") !== null,
        isAdmin: localStorage.getItem('isAdmin'),
        username: localStorage.getItem('username') || '',
        userId: localStorage.getItem('userId') || '',
        updateUser: this.updateUser
      }
    }
  }

  updateUser = (user) => {

    this.setState({
      user
    })

    console.log(this.state)
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <UserProvider value={{ user: this.state.user, updateUser: this.updateUser }}>
            <Header />
            <ToastContainer />
            <Switch>
              <Route path="/" render={props => <Home {...props} />} exact />
              <Route path="/category/:name" component={Category} exact />
              <Route path="/login" component={Login} exact />
              <Route path="/register" component={Register} exact />
              <Route path="/news/send" component={CreateArticle} exact />
              <Route path="/manage/category" component={CategoryManagePage} exact />
              <Route path="/news/details/:id" component={News} exact />
              <Route path="/news/approve" component={ApproveNews} exact />
              <Route path="/news/preview/:id" component={Preview} exact />
              <Route path="/news/edit/:id" component={EditNews} exact />
              <Route path="/user/profile/:username" component={Profile}exact />
              <Route component={NotFound} />
            </Switch>
            <Footer />
          </UserProvider>
        </React.Fragment>
      </BrowserRouter>
    )
  }

}

export default App;
