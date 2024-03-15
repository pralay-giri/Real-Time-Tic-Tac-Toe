import { FaGithub } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav className="px-9 py-2 flex items-center max-md:px-1 max-sm:justify-between max-sm:px-2">
            <div className="w-16 mr-auto max-sm:mr-auto max-sm:w-10">
                <img src="/tic-tac-toe.png" alt="logo" className="w-full" />
            </div>
            <ul className="flex mr-[20%] max-md:mr-[10%] max-sm:mr-0 items-center gap-5 max-sm:gap-2  text-white text-xl max-sm:text-sm *:transition-all cursor-pointer">
                <li className="hover:text-blue-400">
                    <Link to="https://github.com/pralay-giri">
                        <p id="creator" className="text-xl max-sm:text-sm">
                            pralay
                        </p>
                    </Link>
                </li>
                <span className=" w-[2px] h-7 bg-blue-400 rounded-sm animate-pulse max-sm:h-6 max-sm:w-[1px]"></span>
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
