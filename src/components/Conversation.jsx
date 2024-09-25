import { Avatar, AvatarBadge, Flex, Image, Link, Stack, Text, useColorMode, useColorModeValue, WrapItem } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from "../atoms/userAtom"
import { BsCheck2All } from "react-icons/bs"
import { selectedConversationAtom } from '../atoms/messagesAtom';
import { useNavigate } from 'react-router-dom';
 
export default function Conversation({conversation , isOnline}) {

    const user = conversation.participants[0];
    const lastMessage = conversation.lastMessage;
    const currentUser = useRecoilValue(userAtom);
    const [ selectedConversation , setSelectedConversation ] = useRecoilState(selectedConversationAtom);
    const colorMode = useColorMode();

    const navigate = useNavigate();
    const handleVisitProfile = () => {
        navigate(`/${user.username}`);
    };

  return (
    <Flex
        gap={4}
        alignItems={'center'}
        p={'1'}
        _hover={{
            cursor:"pointer",
            bg:useColorModeValue("gray.600" , "gray.dark"),
            color:"white"
        }}
        onClick={() => setSelectedConversation({
            _id:conversation._id,
            userId:user._id,
            userProfilePic:user.profilePic,
            username:user.username,
            mock: conversation.mock,
        })}
        bg={selectedConversation?._id === conversation._id ? (colorMode ==="light" ? "gray.400" : "gray.dark") : ""}
        borderRadius={"md"}
    >
        
        <WrapItem>
            <Avatar 
                size={{
                    base:"xs",
                    sm:"sm",
                    md:"md"
                }}
                src={user.profilePic}
                onClick={handleVisitProfile}
            >
            {isOnline ? <AvatarBadge boxSize='1em' bg="green.500" /> : ""}
            </Avatar>
        </WrapItem>

        <Stack direction={'column'} fontSize={"sm"} >
            <Text fontWeight='700' display={"flex"} alignItems={'center'} >
                  {user.username} <Image src='/verified.png' w={4} h={4} ml={1} />
            </Text>
            <Text fontSize={'xs'} display={"flex"} alignItems={'center'} gap={1} >
                {currentUser._id === lastMessage.sender ? <BsCheck2All size={16} /> : ""}
                {lastMessage.text.length > 18 ? lastMessage.text.substring(0 , 18) + "..." : lastMessage.text}
            </Text>
        </Stack>

    </Flex>
  )
}
