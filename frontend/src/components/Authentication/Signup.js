import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from 'axios';

export const Signup = () => {
  const toast = useToast()
  const [loading, setloading] = useState(false)
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [confirmPassword, setconfirmPassword] = useState();
  const [picture, setpicture] = useState();
  const [show, setshow] = useState(false);

  const handleClick = () => setshow(!show);

  const handSubmit = async () => {
    try {
      setloading(true)
      if (!name && !email && !password) {
        return toast({
          title: "Missing Fields",
          description: "Please Enter the Required Fields",
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
      if (password === confirmPassword) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (picture) {
          formData.append("pic", picture);
        }
        const response = await axios.post('/api/user/signup', formData);
        console.log(response.data.message);
        setname('')
        setemail('')
        setpassword('');
        setconfirmPassword('')
        setpicture('')
        toast({
          title: response.data.message,
          description: "We've created your account for you.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        console.log("Password not matched");
      }
    } catch (error) {
      console.log(error);
    } finally{
      setloading(false);
    }
  };

  return (
    <>
      <VStack spacing={"5px"}>
        <FormControl isRequired id="name">
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={name}
            placeholder="Enter Your Name"
            onChange={(e) => setname(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            placeholder="Enter Your Email"
            onChange={(e) => setemail(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired id="password">
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
            value={password}
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

        <FormControl isRequired id="confirmpassword">
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
            value={confirmPassword}
              type={show ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setconfirmPassword(e.target.value)}
            />
            <InputRightElement>
              <Button size={"sm"} h={"1.75rem"} onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="profilePic">
          <FormLabel>Choose Profile Pic (optional)</FormLabel>
          <Input
            type="file"
            value={picture}
            onChange={(e) => setpicture(e.target.files[0])}
            placeholder="Confirm Password"
          />
        </FormControl>

        <Button colorScheme="blue" width={"100%"} mt={15} onClick={handSubmit} isLoading={loading}>
          Sign Up
        </Button>
      </VStack>
    </>
  );
};
