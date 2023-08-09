import "./Footer.css";

const Footer = () => {
  return (
    <div className="Container">
      <footer className="my-5 pt-5 text-muted text-center text-small">
        <div className="row align-items-center justify-content-center footer_text">
          <div className="col-9 text-center">
            <span>
              We use necessary cookies to allow our site to function correctly
              and collect anonymous session data. Necessary cookies can be opted
              out through your browser settings.
            </span>
          </div>
        </div>
        <div className="row justify-content-center footer_copyRight">
          <div className="col-auto">
            <p>Copyright © 2021 Pawsup All rights reserved.</p>
          </div>
        </div>

        <ul className="list-inline">
          <li className="list-inline-item">
            <a href="/">Privacy</a>
          </li>
          <li className="list-inline-item">
            <a href="/">Terms</a>
          </li>
          <li className="list-inline-item">
            <a href="/">Support</a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Footer;
