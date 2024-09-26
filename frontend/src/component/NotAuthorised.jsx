const NotAuthorised = () => {
    return(
        <div className="container d-flex flex-column justify-content-center align-items-center">
            <h1 className="text-danger display-4">Access Denied</h1>
            <p className="lead">You are not authorised to view this page.</p>
        </div>
    )
}

export default NotAuthorised;