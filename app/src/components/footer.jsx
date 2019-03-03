import React from 'react'

const Footer = () => {
        return (
            <footer className="bg-info footer mt-4">
                <div className="container ">
                    <ul className="list-unstyled list-inline text-center">
                        <li className="list-inline-item ">
                            <a className="btn-floating btn-fb mx-5 text-white"  href="/">
                                <i className="fab fa-facebook-f"> </i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a className="btn-floating btn-tw mx-5 text-white"  href="/">
                                <i className="fab fa-twitter"> </i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a className="btn-floating btn-gplus mx-5 text-white"  href="/">
                                <i className="fab fa-google-plus-g"> </i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a className="btn-floating btn-li mx-5 text-white" href="/">
                                <i className="fab fa-linkedin-in"> </i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a className="btn-floating btn-dribbble mx-5 text-white"  href="/">
                                <i className="fab fa-dribbble"> </i>
                            </a>
                        </li>
                        
                    </ul>
                </div>
                <div className="footer-copyright text-center text-white">© 2019 Copyright: GeorgiAtansov15
                </div>
            </footer>

        )
    }


export default Footer