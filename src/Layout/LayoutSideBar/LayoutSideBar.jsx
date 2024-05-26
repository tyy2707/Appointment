import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { FloatButton } from 'antd';
import ChatGpt from "../../components/ChatGpt/ChatGpt";
import { useState } from "react";
import { Button } from "@mui/material";
const Layout = (props) => {
    const { isShowChat = false } = props
    const [showChatbox, setShowChatbox] = useState(false);
    const handleClick = () => {
        setShowChatbox(!showChatbox);
    };
    return (
        <div className="flex flex-col">
            <Header />
            <div className=''>
                {props.children}
            </div>
            {props.isShowChat &&
                <div className="fixed bottom-20 right-20">
                    <div className="w-4 h-4">
                        <Button className={`btn-chatbox rounded-lg ${showChatbox ? "show" : ""}`} onClick={handleClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45" height="45" viewBox="0 0 48 48">
                                <path fill="#448AFF" d="M24,4C13.5,4,5,12.1,5,22c0,5.2,2.3,9.8,6,13.1V44l7.8-4.7c1.6,0.4,3.4,0.7,5.2,0.7c10.5,0,19-8.1,19-18C43,12.1,34.5,4,24,4z"></path><path fill="#FFF" d="M12 28L22 17 27 22 36 17 26 28 21 23z"></path>
                            </svg>
                        </Button>
                        {showChatbox && <ChatGpt handleClose={() => setShowChatbox(false)} />}
                    </div>
                </div>
            }
            <Footer />
        </div>
    );
};

export default Layout;