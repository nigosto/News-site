import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.getArticle = this.getArticle.bind(this)
  }

  getArticle(e) {
    e.preventDefault()
    console.log(this.props.match.params)
    let variable = this.props.match.params.nqkakvoid
    return fetch(`http://localhost:9999/feed/article/${variable}`).then(res => res.json()).then(body => console.log(body.article))
      
  }

  render() {
    return (
      <form onSubmit={(e) => { e.preventDefault(); this.props.history.push(`/article/${this.props.match.params.nqkakvoid}`); console.log('did') }}>
        <input id="name" />
        <button onClick={(e) => this.getArticle(e)}>Get</button>
        <button type="submit">Submit</button>
      </form>
    )
  }

  async componentDidMount() {
    // console.log(`https://swapi.co/api/${this.props.match.params.nqkakvoid}`)
    // fetch(`https://swapi.co/api/${this.props.match.params.nqkakvoid}`, {
    //   mode: 'no-cors'
    // }).then(res => res.json())
    //   .then(body => body.results)
  }

  
}

export default App;
