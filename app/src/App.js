import React, { Component } from 'react';
import './App.css';
import Header from './components/header';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import NotFound from './views/notFound'
import Category from './views/category';
import Login from './views/login';
import Footer from './components/footer';
import Register from './views/register';
import Home from './views/home';
import { ToastContainer } from 'react-toastify'
import { UserProvider } from './components/contexts/user-context';
import CreateNews from './views/createNews';
import CategoryManagePage from './views/createCategory'
import News from './views/news';
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
              <Route path="/news/send" component={CreateNews} exact />
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
