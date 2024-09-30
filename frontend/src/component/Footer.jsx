import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import {Link, Outlet} from 'react-router-dom';

const Footer = () => {

    const handleFacebookClick = () => {
        window.open("https://www.facebook.com", "_blank");
    }
    const handleInstagramClick = () => {
        window.open("https://www.instagram.com", "_blank");
    }
    const handleTwitterClick = () => {
        window.open("https://www.x.com", "_blank");
    }

    return (
        // <footer className="footer">

        <div className="bg-dark text-light mt-auto">
            <div className="container p-3">
                <div className="d-flex justify-content-between">
                    <ul className="d-flex list-unstyled gap-5">
                        <li>
                            <Link to="/aboutUs" className="text-decoration-none text-white">About Us</Link>
                        </li>
                        <li>
                            <Link to="/contactUs" className="text-decoration-none text-white">Contact Us</Link>
                        </li>
                        <li>
                            <Link to="/" className="text-decoration-none text-white">Read Blogs</Link>
                        </li>
                        <Outlet></Outlet>
                    </ul>
                    <ul className="d-flex list-unstyled gap-5">
                        <li onClick={handleFacebookClick}><FaFacebook size={35}></FaFacebook></li>
                        <li><FaInstagram size={35} onClick={handleInstagramClick}></FaInstagram></li>
                        <li><FaXTwitter size={35} onClick={handleTwitterClick}></FaXTwitter></li>
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