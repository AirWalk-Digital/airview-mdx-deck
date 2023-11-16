import { Outlet, NavLink, Link } from "react-router-dom";

import github from "../../assets/Airwalk-Reply-White-Logo.svg";

import styles from "./Layout.module.css";

const Layout = ({children}) => {
    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <nav>
                        <ul className={styles.headerNavList}>
                            <li className={styles.headerNavLeftMargin}>
                                <a href="https://airwalkreply.com/" target={"_blank"} title="AIRWALKREPLY HOMEPAGE">
                                    <img
                                        src={github}
                                        alt="Github logo"
                                        aria-label="Link to github repository"
                                        width="20px"
                                        height="20px"
                                        className={styles.githubLogo}
                                    />
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <h4 className={styles.headerRightText}>LET'S CHAT</h4>
                </div>
            </header>

            <main>{children}</main>
        </div>
    );
};

export default Layout;
