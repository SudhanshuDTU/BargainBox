import { FC } from "react";
import { View, StyleSheet, TextInput, Pressable, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "@utils/colors";

interface Props {
  asButton?: boolean;
  onPress?(): void;
  onChange?(text:string):void;
  value?:string;

}

const SearchBar: FC<Props> = ({ asButton, onPress,onChange,value }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <AntDesign name="search1" size={20} color={colors.primary} />

      {asButton ? (
        <View style={styles.textInputView}>
          <Text style={styles.fakePlaceholder}>Search here...</Text>
        </View>
      ) : (
        <TextInput onChangeText={onChange} value={value}  placeholder="Search here..." style={styles.textInput} autoFocus />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    padding: 10,
  },
  textInput: {
    paddingLeft: 10,
    flex: 1,
    color: colors.primary,
    fontSize: 18,
  },
  textInputView: {
    paddingLeft: 10,
    flex: 1,
  },
  fakePlaceholder:{
    color: colors.primary,
    fontSize: 18,
    opacity: 0.5,
    fontWeight : '200'
  }
});

export default SearchBar;
