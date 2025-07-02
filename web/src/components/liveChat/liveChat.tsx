"use client"

import { useState, useRef } from 'react';
import Image from 'next/image';
import liveChatIcon from "../../assets/icons/speech-balloon_11385424.png";
import { StaticImageData } from 'next/image';
import "./liveChat.css";

const LiveChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Here you can handle the file upload
            console.log('Selected file:', file.name);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="live-chat-container">
            <div className={`chat-popup ${isOpen ? 'open' : ''}`}>
                <div className="chat-header paper-texture">
                    <h3>ონლაინ ჩათი</h3>
                    <button onClick={toggleChat} className="close-button">×</button>
                </div>
                <div className="chat-messages paper-texture">
                    <div className="message received">
                        გამარჯობა! როგორ შემიძლია დაგეხმაროთ?
                    </div>
                    <div className="message sent">
                        გამარჯობა! მაინტერესებს თქვენი სერვისები
                    </div>
                </div>
                <div className="chat-input paper-texture">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        accept="image/*,.pdf,.doc,.docx"
                    />
                    <button 
                        className="upload-button" 
                        onClick={triggerFileInput}
                        title="ფაილის ატვირთვა"
                    >
                        📎
                    </button>
                    <input type="text" placeholder="დაწერეთ მესიჯი..." />
                    <button>გაგზავნა</button>
                </div>
            </div>
            <div className="chat-icon" onClick={toggleChat}>
                <Image src={liveChatIcon as StaticImageData} alt="Live Chat" />
            </div>
        </div>
    );
}

export default LiveChat;
