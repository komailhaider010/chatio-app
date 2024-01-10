import { Box } from '@chakra-ui/react'
import React from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'

export const UserBadgeItem = ({user, handleFuntion}) => {
  return (
    <Box
    key={user._id}
    display={"flex"}
    justifyContent={"center"}
    alignItems={"center"}
    px={2}
    py={1}
    borderRadius={"lg"}
    m={1}
    mb={2}
    color={"white"}
    fontWeight={"bold"}
    fontSize={12}
    background={"lightgreen"}
    cursor={"pointer"}
    onClick={handleFuntion}
    >
        {user.name}
        <IoCloseCircleOutline/>

    </Box>
  )
}
