import { View, Text, Pressable } from 'react-native'
import React, { ReactNode } from 'react'

interface IDoublePressable {
    onDoublePress?: () => void;
    children:ReactNode
}

const DoublePressable = ({onDoublePress=()=>{}, children}: IDoublePressable) => {
    let lastTap = 0;

    const handleDoublePress = () =>{
      
      console.log(lastTap);
      const now = Date.now(); //timestamp 
      if (now - lastTap < 300) {
        onDoublePress();
      }
    
      lastTap = now;
    }
    
    return (
        <Pressable onPress={handleDoublePress}>
            {children}
        </Pressable>
    )


}

export default DoublePressable