import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  Text,
  Keyboard,
  Image,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import SearchBar from "./SearchBar";
import colors from "@utils/colors";
import size from "@utils/size";
import EmptyView from "@ui/EmptyView";
import LottieView from "lottie-react-native";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { debounce } from "@utils/helper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import { AppStackParamList } from "app/navigator/AppNavigator";

interface Props {
  visible: boolean;
  onClose(visible: boolean): void;
}
const searchResults = [
    {id:1,name: "iPhone 13"},
    {id:2,name: "iPhone 14"},
    {id:3,name: "iPhone 15"},
    {id:4,name: "iPhone 16"},
    {id:5,name: "iPhone 17"},
    {id:6,name: "iPhone 18"},

]
type searchResultType = {
    id: string;
    name: string;
    thumbnail?:string;
}
const SearchModal: FC<Props> = ({ visible, onClose }) => {
    const [keyboardHeight, setkeyboardHeight] = useState(0)
    const [busy, setbusy] = useState(false)
    const [query, setquery] = useState('')
    const [notfound, setnotfound] = useState(false)
    const [result, setresult] = useState<searchResultType[]>([])
    const {navigate} = useNavigation<NavigationProp<AppStackParamList>>()

  const handleClose = () => {
    onClose(!visible);
  };
  useEffect(()=>{
    const keyShowListener = Keyboard.addListener(Platform.OS == "ios"? 'keyboardWillShow': 'keyboardDidShow',(event)=>{
       setkeyboardHeight(event.endCoordinates.height + 50 )
    })
    const keyHideListener = Keyboard.addListener(Platform.OS == "ios"? 'keyboardWillHide': 'keyboardDidHide',(event)=>{
       setkeyboardHeight(0 )
    })
    return ()=>{
        keyShowListener.remove()
        keyHideListener.remove()
    }},[])

   
    const searchProduct = async(query:string)=>{
        if(query.trim().length >=3){
            return await runAxiosAsync<{results: searchResultType[]}>(authClient.get('/product/search?query='+query))
        }
    }
    const searchDebounce = debounce(searchProduct,300)
  
    const {authClient} = useClient()
    const handleChange = async (value:string)=>{
        setnotfound(false)
        setbusy(true)
          setquery(value)
      const resp = await searchDebounce(value)
      setbusy(false)
      if(resp){
        if(resp.results.length){
            setresult(resp.results)
        }else{
            setnotfound(true)
        }
      }
    }
    const handleOnResultPress = (result:searchResultType)=>{
        navigate('SingleProduct',{id: result.id})
        handleClose()
    }

  return (
    <Modal onRequestClose={handleClose} visible={visible} animationType="fade">
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
            {/* search bar */}
          <View style={styles.header}>
            <Pressable onPress={handleClose}>
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color={colors.primary}
              />
            </Pressable>
            <View style={{ flex: 1, marginLeft: size.padding }}>
              <SearchBar onChange={handleChange} value={query} />
            </View>
          </View>

          {/* Busy Indicator */}
         {busy? <View style={styles.busyIconIndicator}>
        <View style={styles.busyAnimationSize}>
          <LottieView
            style={styles.flex1}
            autoPlay
            loop
            source={require("../../assets/loading_2.json")}
          />
        </View>
      </View> : null}


          {/* {suggestions} */}
         <View style={{paddingBottom: keyboardHeight}}> 
         <FlatList data={!busy ? result : []} renderItem={({item,index})=>
             <Pressable style={styles.searchResultItem} onPress={()=>handleOnResultPress(item)}>
            
                <Image source={{uri: item.thumbnail || undefined}} style={styles.thumbnail} />
                  <Text style={styles.suggestionListItem}>{item.name}</Text>
             </Pressable>
          } keyExtractor={(item)=> item.id.toString()} contentContainerStyle={styles.suggestionList} ListEmptyComponent={notfound ? <EmptyView title="No results found..."/> : null}/>
         </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  thumbnail:{
    width:60,
    height: 40,
    marginRight: 5
  },
  searchResultItem:{
    flexDirection:'row',
    marginBottom: 7
  },
  innerContainer: {
    padding: size.padding,
    flex:1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionList:{
    padding: size.padding,
  },
  suggestionListItem:{
   color: colors.primary,
   fontWeight:'600',
   paddingVertical: 7,
   fontSize: 18

  },
  busyIconIndicator:{
    flex : 0.3,
    alignItems: 'center',
    justifyContent:'center',
    
  },
  busyAnimationSize:{
    height: 100,
    width:100
  },
  common: {
    width: 50,
    height: 50,
    bottom: 20,
    right: 20,
    position: "absolute",
  },flex1: {
    flex: 1,
  },
});
export default SearchModal;
