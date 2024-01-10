import React from 'react'
import { Box } from '@chakra-ui/react'
import { SideDrawer } from '../components/SideDrawer'
import { UserChats } from '../components/UserChats'
import { ChatBox } from '../components/ChatBox'
import { useState } from 'react'

export const Dashboard = () => {
  const [fetchAgain, setfetchAgain] = useState(false)
  return (
    <>
    <div style={{width:"100%"}}>

      {<SideDrawer/>}
      <Box
      display={'flex'}
      justifyContent={'space-between'}
      w={"100%"}
      h={'91.5vh'}
      p={'10px'}
      >
        <UserChats fetchAgain={fetchAgain}/>
        <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
      </Box>


    </div> 
    </>
  )
}
