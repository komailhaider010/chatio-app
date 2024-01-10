import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

export const ChatsLoading = () => {
  return (
    <Stack>
        <Skeleton height={"2.5rem"}/>
        <Skeleton height={"2.5rem"}/>
        <Skeleton height={"2.5rem"}/>
        <Skeleton height={"2.5rem"}/>
        <Skeleton height={"2.5rem"}/>
        <Skeleton height={"2.5rem"}/>
        <Skeleton height={"2.5rem"}/>
        <Skeleton height={"2.5rem"}/>
    </Stack>
  )
}
