import {
  FormControl,
  VStack,
  Button,
  Input,
  InputRightElement,
  InputGroup,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false)
  const toast = useToast()
  const [password, setpassword] = useState();
  const [email, setemail] = useState();
  const [show, setshow] = useState();

  const handleClick = () => setshow(!show);

  const handSubmit = async () => {
    try {
      setloading(true)
      const response = await axios.post('/api/user/login', {email, password});

      if(response.status === 200){
        console.log(response.data);
        toast({
          title: response.data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally{
      setloading(false)
    }
  };
  return (
    <>
      <VStack spacing={"5px"}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Email"
            onChange={(e) => setemail(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Your Password"
              onChange={(e) => setpassword(e.target.value)}
            />
            <InputRightElement>
              <Button size={"sm"} h={"1.75rem"} onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button colorScheme="blue" width={"100%"} mt={15} onClick={handSubmit}
        isLoading={loading}
        >
          LogIn
        </Button>

        <Button
          variant={"solid"}
          colorScheme="red"
          width={"100%"}
          mt={15}
          onClick={() => {
            setemail("guest@email.com");
            setpassword("123456789");
          }}
        >
          Guest User Login
        </Button>
      </VStack>
    </>
  );
};
