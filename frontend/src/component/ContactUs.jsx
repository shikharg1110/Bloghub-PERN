const ContactUs = () => {
    return (
        <div className="container mb-3">
            <h1 className="text-center">Contact Us</h1>
            <form className="row g-3">
                <div className="col-md-6">
                    <label for="inputFirstName" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="inputFirstName" />
                </div>
                <div className="col-md-6">
                    <label for="inputLastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="inputLastName" />
                </div>
                <div class="col-12">
                    <label for="inputEmail" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="inputEmail" />
                </div>
                <div class="col-12">
                    <label for="inputMessage" className="form-label">Write us a message</label>
                    <textarea name="" id="inputMessage" className="form-control"></textarea>
                </div>
                <div class="col-12">
                    <button type="submit" class="btn btn-dark">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default ContactUs;