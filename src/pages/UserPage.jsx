import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from  "../hooks/useShowToast"
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import API_BASE_URL from "../App"

export default function UserPage() {

  const { username } = useParams();
  const showToast = useShowToast()
  const [ posts , setPosts ] = useRecoilState(postsAtom);
  const [ fetchingPosts , setFetchingPosts ] = useState(true);
  const { user , loading } = useGetUserProfile();



  useEffect(()=>{
 

    const getPosts = async () =>{
      setFetchingPosts(true);
      try{
        const res = await fetch(`${API_BASE_URL}/api/posts/user/${username}`);
        const data = await res.json();
        setPosts(data);
      }
      catch(error){
        showToast("Error", error.message, "error");
        setPosts([]);
      }
      finally{
        setFetchingPosts(false);
      }
    }

    getPosts();
  },[username,showToast,setPosts])

  if(!user && loading){
    return (
      <Flex justifyContent={'center'} >
        <Spinner size='xl' />
      </Flex>
    )
  }

  if(!user && !loading) return <h1>User not found</h1>

  return (
    <>
      <UserHeader user={user} />

      {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12} >
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) =>(
        <Post key={post._id} post={post} postedBy={post.postedBy}  />
      ))}

    </>
  )
}
