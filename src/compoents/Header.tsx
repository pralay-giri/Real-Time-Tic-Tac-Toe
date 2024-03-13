import { FaGithub } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav className="px-9 py-2 flex items-center">
            <div className="w-16 mr-auto">
                <img src="/tic-tac-toe.png" alt="logo" className="w-full" />
            </div>
            <ul className="flex mr-[20%] items-center gap-5 text-white text-xl *:transition-all cursor-pointer">
                <li className="hover:text-blue-400">
                    <Link to="https://github.com/pralay-giri">
                        <p id="creator" className="text-xl">
                            pralay
                        </p>
                    </Link>
                </li>
                <span className=" w-[2px] h-7 bg-blue-400 rounded-sm animate-pulse"></span>
                <li className="hover:text-blue-400">
                    <Link
                        to="https://github.com/pralay-giri"
                        target="_blank"
                        rel="external"
                        referrerPolicy="no-referrer"
                    >
                        <FaGithub />
                    </Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link
                        to="https://www.linkedin.com/in/prala-ygiri/"
                        target="_blank"
                        rel="external"
                        referrerPolicy="no-referrer"
                    >
                        <FaLinkedin />
                    </Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link
                        to="https://leetcode.com/pralaygiri297/"
                        target="_blank"
                        rel="external"
                        referrerPolicy="no-referrer"
                    >
                        <SiLeetcode />
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Header;
