'use client'

import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import UsePreviewImg from '../hooks/UsePreviewImg';
import useShowToast from '../hooks/useShowToast';
import API_BASE_URL from "../App"

export default function UpdateProfilePage() {
    const [user , setUser] = useRecoilState(userAtom);
    const [inputs , setInputs] = useState({
        name:user.name,
        username:user.username,
        email:user.email,
        bio:user.bio,
        password:""
    });
    
    const showToast = useShowToast();

    const fileRef = useRef(null);
    const [updating , setUpdating] = useState(false);

    const { handleImageChange , imgUrl} = UsePreviewImg();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(updating) return;
        setUpdating(true);
        try{

            const res = await fetch(`${API_BASE_URL}/api/users/update/${user._id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({...inputs , profilePic:imgUrl}),
            })


            const data = await res.json();
            if(data.error){
                showToast("Error" , data.error , "error");
                return;
            }
            showToast("Success" , "Profile updated successfully." , "success");
            setUser(data);
            localStorage.setItem("user-threads" , JSON.stringify(data));
        }
        catch(error){
            showToast("Error" , error , "error");
        }
        finally{
            setUpdating(false);
        }
    }




    return (
        <form onSubmit={handleSubmit} >
            <Flex
                align={'center'}
                justify={'center'}
                my={6}
                >
                <Stack
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={6}
                    >
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        User Profile Edit
                    </Heading>
                    <FormControl id="userName">
                        <Stack direction={['column', 'row']} spacing={6}>
                            <Center>

                                <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic}/>
                                {/* <Image boxSize="50px" borderRadius='full' boxShadow={"md"} src={imgUrl || user.profilePic} /> */}

                            </Center>
                            <Center w="full">
                                <Button w="full" onClick={()=> fileRef.current.click()} >Change Avatar</Button>
                                <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl >
                        <FormLabel>Full name</FormLabel>
                        <Input
                            value={inputs.name}
                            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                            placeholder="Full Name"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>User name</FormLabel>
                        <Input
                            placeholder="UserName"
                            value={inputs.username}
                            onChange={(e) => setInputs({...inputs , username:e.target.value})}
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Email address</FormLabel>
                        <Input
                            value={inputs.email}
                            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                            placeholder="your-email@example.com"
                            _placeholder={{ color: 'gray.500' }}
                            type="email"
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Bio</FormLabel>
                        <Input
                            value={inputs.bio}
                            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                            placeholder="Your Bio..."
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Password</FormLabel>
                        <Input
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                            placeholder="password"
                            _placeholder={{ color: 'gray.500' }}
                            type="password"
                        />
                    </FormControl>
                    <Stack spacing={6} direction={['column', 'row']}>
                        <Button
                            bg={'red.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'red.500',
                            }}
                            >
                            Cancel
                        </Button>
                        <Button
                            bg={'green.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'green.500',
                            }}
                            type='submit'
                            isLoading={updating}
                            >
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    )
}

