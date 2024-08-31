import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const selectImages = async () => {
  let result: string[] = [];
  try {
    const { assets } = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.3,
      allowsMultipleSelection: true,
    });

    if (assets) {
      result = assets.map(({ uri }) => uri);
    }
  } catch (error) {
    showMessage({ message: (error as any).message, type: "danger" });
  }

  return result;
};

let timeoutID : NodeJS.Timeout
export const debounce = <T extends any[],R>(func: (...args:T)=> Promise<R>,timeout:number)=>{
  return (...arg: T): Promise<R> =>{
     return new Promise<R>((resolve)=>{
      clearTimeout(timeoutID)
    timeoutID = setTimeout(async ()=>{
     const res =  await func(...arg)
     resolve(res)
    },timeout)
     })
    
   }
}


