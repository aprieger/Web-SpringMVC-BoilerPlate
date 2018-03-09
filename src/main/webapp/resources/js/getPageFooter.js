class Footer extends React.Component {
    render() {        
        return (
            <div className="footer-container">
                <a href="https://spring.io/docs" className="footer-link">Spring Documentation</a>
                <a href="https://reactjs.org/" className="footer-link">ReactJS Documentation</a>
                <a href="https://docs.mongodb.com/" className="footer-link">MongoDB Documentation</a>
            </div>
        );
    }
};
ReactDOM.render(
    <Footer />,
    document.getElementById('reactFooter')
);