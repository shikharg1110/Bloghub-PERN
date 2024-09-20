import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import {Link, Outlet} from 'react-router-dom';

const Footer = () => {
    return (
        // <footer className="footer">

        <div className="bg-dark text-light mt-auto">
            <div className="container p-3">
                <div className="d-flex justify-content-between">
                    <ul className="d-flex list-unstyled gap-5">
                        <li>
                            <Link to="/aboutUs">About Us</Link>
                        </li>
                        <li>
                            <Link to="/contactUs">Contact Us</Link>
                        </li>
                        <li>
                            <Link to="/">Read Blogs</Link>
                        </li>
                        <Outlet></Outlet>
                    </ul>
                    <ul className="d-flex list-unstyled gap-5">
                        <li><FaFacebook size={35}></FaFacebook></li>
                        <li><FaInstagram size={35}></FaInstagram></li>
                        <li><FaXTwitter size={35}></FaXTwitter></li>
                    </ul>
                </div>
                <div>
                    &#169; Copyright BlogHub Shikhar Website 2024
                </div>
            </div>
        </div>
        // </footer>
    );
}

export default Footer;