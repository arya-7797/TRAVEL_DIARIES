import React, { useState, useRef, useEffect,useCallback } from 'react'
import './chat.scss'
import {useNavigate} from 'react-router-dom'
import CreateGroup from './CreateGroup';
import { styled } from '@mui/material/styles';
import axios from '../../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setGroups, addGroup, pushMessages } from '../../state/index';
import MessagesSection from './MessagesSection';
import { addDoc, collection, getDoc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Navbar from 'scenes/navbar';
import MenuIcon from '@mui/icons-material/Menu';
import SendIcon from '@mui/icons-material/Send';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { clientUrl } from 'utils/constants';


const callModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
const CommunityChat = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user);
    const [inputValue, setInputValue] = useState("");
    const messageRef = collection(db, "GroupChat")
    const token = useSelector(state => state.token);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const groups = useSelector(state => state.groups);
    const [value,setValue]=useState();
    const navigate=useNavigate()

    // join video call modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const [isLeftMainVisible, setIsLeftMainVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 750) {
                setIsMobileMenuOpen(true)
                setIsLeftMainVisible(false);
            } else {
                setIsLeftMainVisible(true);
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsLeftMainVisible(!isLeftMainVisible);
    };


    // Send Message
    async function handleSendMessage(roomCode,room) {
        if(room){
            roomCode = clientUrl+"room/"+roomCode+" Join the room"
            let newMessage = {
                group: selectedGroup?.name, 
                groupDp: selectedGroup?.image,
                sender: currentUser?._id,
                senderUsername: currentUser?.firstName,
                senderDp: currentUser?.picturePath,
                type: 'text',
                text: roomCode,
                createdAt: serverTimestamp(),
            }
            await addDoc(messageRef, newMessage)
        }
        if (inputValue.trim() !== "") {
            let newMessage = {
                group: selectedGroup?.name,
                groupDp: selectedGroup?.image,
                sender: currentUser?._id,
                senderUsername: currentUser?.firstName,
                senderDp: currentUser?.picturePath,
                type: 'text',
                text: inputValue,
                createdAt: serverTimestamp(),
            }
            await addDoc(messageRef, newMessage)
            setInputValue("");
        }
    }

    const LargeVideoCallIcon = styled(VideoCallIcon)({
        fontSize: '35px',
      });
      const roomCodeInputRef = useRef(null);

    const handleVideoIconClick = () => {
      roomCodeInputRef.current.focus();
    };
    const handleJoinRoom=useCallback(()=>{
        setInputValue(()=>value+' link')
        let room = true;
         handleSendMessage(value,room);
        navigate(`/room/${value}`);
    },[navigate,value])

    //Getting all group from server
    const getAllGroups = async () => {
        try {
            const response = await axios.get('chat/group', {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            dispatch(setGroups({ groups: response?.data }));

        } catch (error) {
            console.log('get group error ', error)
        }
    }


    useEffect(() => {
        getAllGroups();
    }, []);

    


    return (
        <>
            <Navbar />
            <div className="superMain">

                <div className='mx-5 mb-5 chatMain  shadow-lg'>
                    {/* <i className="bi bi-three-dots mt-3 mx-3 " onClick={toggleMobileMenu}></i> */}
                    {isMobileMenuOpen && (
                        <i className="bi bi-three-dots mt-3 mx-3 " onClick={toggleMobileMenu}></i>
                    )}

                    {isLeftMainVisible && (
                        <div className="left-main shadow-lg " style={{ position: 'relative' }}>
                            <div className="title fs-3">Communities</div>
                            <div className="channels  ">
                                {
                                    groups &&
                                    groups?.map((group, index) => {
                                        return (

                                            <div className="singleChannel" key={group?._id} onClick={() => { 
                                                setSelectedGroup(group); 
                                                if(window.innerWidth < 750){
                                                    setIsLeftMainVisible(false)
                                                    setIsMobileMenuOpen(true)
                                                }
                                                }}>
                                                <div className="img" style={{ height: '50px', width: '50px', backgroundImage: `url(${group?.image})`, backgroundSize: 'cover', borderRadius: '50%' }}></div>
                                                <span className='d-block'>{group?.name}</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <CreateGroup />
                        </div>
                    )}

                  


                    <div className="right-main">
                        <div className="chat-container">
                            <MessagesSection selectedGroup={selectedGroup} />

                            {/* //MessageInput */}
                            <div className="chat-footer">
                                <input type="text" placeholder="Type your message here" value={inputValue} autoComplete='off'
                                    onChange={(event) => setInputValue(event.target.value)}
                                    onKeyDown={(event) => { if (event.key === 'Enter') handleSendMessage() }} />
                                    <div className='d-flex'>
                                        <button onClick={handleSendMessage}>
                                            <SendIcon />
                                        </button>
                                        <button className='mx-1' onClick={handleOpen}>
                                            <LargeVideoCallIcon />
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </div>

      

                </div>
            </div>


            {/* modal */}
            <div>
      <Modal fullWidth aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" open={open} onClose={handleClose} closeAfterTransition slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          }
        }}
      >
        <Fade in={open} >
          <Box sx={callModalStyle}>
          <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }}} noValidate autoComplete="off">
      <div>
        <TextField id="outlined-required" className="w-100" label="Enter Room Code" defaultValue="" fullWidth
             value={value}    onChange={(e)=>setValue(e.target.value)} ref={roomCodeInputRef}
        />
        <button onClick={handleJoinRoom} className='btn btn-success w-100'>Create Room</button>
      </div>
    </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
        </>
    )
}

export default CommunityChat
