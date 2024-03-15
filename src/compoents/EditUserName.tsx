import { FormEvent, useEffect, useRef, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

const EditUserName = () => {
    const navigator: NavigateFunction = useNavigate();
    const [inputName, setInputName] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const userName = localStorage.getItem('userName');
        if (!userName) return;
        setInputName(userName);
    }, []);

    const saveInfo = (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
        e.preventDefault();
        if (!inputName.trim().length) return;
        localStorage.setItem('userName', inputName);
        navigator('/');
    };

    return (
        <div className="w-full h-[60vh] flex justify-center items-center">
            <form
                onSubmit={saveInfo}
                className="w-5/12 max-sm:w-10/12 m-auto *:mb-4"
            >
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        required
                        placeholder="enter your name"
                        className="w-[100%] py-3 text-lg max-sm:text-base px-2 rounded-md bg-transparent border border-white outline-none transition-all focus-visible:border-blue-400 focus-visible:shadow-md focus-visible:shadow-blue-300 hover:border-blue-400"
                    />
                </div>
                <button className="w-[100%] py-3 px-2 rounded-md border bg-blue-400 text-black text-xl max-sm:text-sm font-bold border-none outline-none focus-visible:bg-opacity-90 transition-all hover:bg-opacity-70">
                    save
                </button>
                <button
                    className="w-[100%] py-3 px-2 rounded-md border bg-blue-400 text-black text-xl max-sm:text-sm font-bold border-none outline-none focus-visible:bg-opacity-90 transition-all hover:bg-opacity-70"
                    onClick={() => navigator('/')}
                >
                    back
                </button>
            </form>
        </div>
    );
};

export default EditUserName;
