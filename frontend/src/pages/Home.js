import React from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Login } from "../components/Authentication/Login";
import { Signup } from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("token");
     if(user){
      navigate('/dashboard');
     }
  }, [navigate])
  

  return (
    <>
      <Container maxW="xl" centerContent>
        <Box
          bg={"white"}
          display={"flex"}
          justifyContent={"center"}
          p={3}
          w={"100%"}
          m={"40px 0 15px 0"}
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Text fontSize={"3xl"}> Chatio</Text>
        </Box>

        <Box
          bg={"white"}
          w={"100%"}
          p={4}
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Tabs variant="soft-rounded">
            <TabList mb={'1em'}>
              <Tab w={'50%'}>Login</Tab>
              <Tab w={"50%"}>Signup</Tab>
            </TabList>
            <TabPanels>
              <TabPanel><Login/></TabPanel>
              <TabPanel><Signup/></TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};
