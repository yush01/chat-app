import axios from "axios";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Welcome from "./Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
const Chat = () => {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setcurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  useEffect(() => {
    const fun = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setcurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
      }
    };
    fun();
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  console.log(currentUser);
  useEffect(() => {
    const fun = async () => {
      try {
        if (currentUser) {
          console.log("inside try->if");
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          console.log("data===>", data);

          setContacts(data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fun();
  }, [currentUser]);
  console.log("Contacts->", contacts);
  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
        )}
      </div>
    </Container>
  );
};
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
