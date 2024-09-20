import Admin from '../img/admin.jpg';
import Author from '../img/author.jpg';
import User from '../img/user.jpg';

const AboutUs = () => {
    return (
        <>
            <div className="container">
                <h1 className="text-center">About Us</h1>
                <div className="box">
                    <div className="admin d-flex mt-5">
                        <div className='w-50 d-flex flex-column justify-content-center'>
                            <h3 className='text-center'>Admin</h3>
                            <p>@Shikhar is the admin of the BlogHub. He can apply the functionality of CRUD on the blogs. He can remove any user, author and blogs. He is the supreme commander of this website</p>
                        </div>
                        <div className='about-img'>
                            <img src={Admin} alt="admin" className='img-fluid about'/>
                        </div>
                    </div>
                    <div className="author d-flex gap-3 mt-5">
                        <div className='about-img'>
                            <img src={Author} alt="author" className='img-fluid'/>
                        </div>
                        <div className='w-50 d-flex flex-column justify-content-center'>
                            <h3 className='text-center'>Author</h3>
                            <p>@Digvijay, @Anash, @Jahanvi and @Arpit are the author of the BlogHub.  Author is created by admin. Admin can apply CRUD functionality on his own blogs. He can view all the blogs but not able to interact with it.</p> 
                        </div>
                    </div>
                    <div className="user d-flex mt-5 mb-5">
                        <div className='w-50 d-flex flex-column justify-content-center'>
                            <h3 className='text-center'>User</h3>
                            <p>User is the one created by admin. The sole purpose of the admin is to view the blogs and that's it.</p>
                        </div>
                        <div className='about-img'>
                            <img src={User} alt="user" className='img-fluid'/>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default AboutUs;