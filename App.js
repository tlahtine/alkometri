import React, {useState} from 'react';
import {useFonts} from 'expo-font';
import { Text, SafeAreaView, TextInput, ScrollView} from 'react-native';
import styles from './Styles';
import {Picker} from '@react-native-picker/picker';
import Radiobutton from './Components/Radiobutton'; 
import CalculateButton from './Components/CalculateButton';

export default function App() {
  /** Load external fonts */
  const[fontsLoaded] = useFonts({
    Rubik: require('./assets/fonts/Rubik-Regular.ttf'), 
    RubikBold: require('./assets/fonts/Rubik-Bold.ttf'),
  });
 
  /** Hooks */
  const [gender, setGender] = useState(1);
  const [weight, setWeight] = useState(0);
  const [bottles, setBottles] = useState(1);
  const [hours, setHours] = useState(1);
  const [bloodAlcLevel, setBAL] = useState(0);
  const [invalidWeight, setInvalidWeight] = useState(false);
  
  /** Constants */
  /** Sexes */
  const genderOptions = [
    {
      label: 'Mies',
      value: 1
    },
    {
      label: 'Nainen',
      value: 2
    }
  ]; 
  /** Number of bottles drunk and hours of drinking */
  const bottlesArray = [];
  const hoursArray = [];
  for (var i = 1; i <= 24; i++) {
    var p1, p2;
    i > 1 ? p1 = "ta" : p1 = "";
    i > 1 ? p2 = "a" : p2 = "";
    bottlesArray.push({
      label: i.toString() + " ravintola-annos" + p1,
      value: i
    })
    hoursArray.push({
      label: i.toString() + " tunti" + p2,
      value: i
    })
  }

  /** Check that weight value is correct and set weight property */
  const checkWeight = (weight) => {
    var error = isNaN(+weight);
    error = !error && (weight < 1);
    setInvalidWeight(error);
    if (!error) setWeight(weight); 
  }

  /** Calculate blood alcohol level */
  const calculateBAL = () => {
    if (weight == 0 || invalidWeight) {
      setBAL(0);
      return;
    }

    var grams = bottles * 0.33 * 8 * 4.5;
    var gramsLeft = grams - (hours * (weight / 10));
    
    var factor = gender == 1 ? 0.7 : 0.6;
    var bloodAlcLevel = gramsLeft / (weight * factor);
    if (bloodAlcLevel < 0 ) bloodAlcLevel = 0;
    setBAL(bloodAlcLevel);
  };
  
  /** Return null if font loading failed */
  if(!fontsLoaded) { return null; }

  /** Return main view */
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Alkometri</Text>
        <Text style={styles.label}>Paino</Text>
        <TextInput style={styles.input} onChangeText={text => checkWeight(text)} placeholder='Paino kiloina' keyboardType='numeric' error={invalidWeight}></TextInput>
        {invalidWeight && <Text style={styles.errorText}>Invalid weight value!</Text> }
        <Text style={styles.label}>Ravintola-annokset</Text>
        <Picker style={styles.input} mode="dropdown" selectedValue={bottles} onValueChange={(itemValue, itemIndex) => setBottles(itemValue)}>
          {bottlesArray.map((t) => {
            return (<Picker.Item label={t.label} value={t.value} key={t.value}/>)
          })}
        </Picker>
        <Text style={styles.label}>Aika</Text>
        <Picker style={styles.input} mode="dropdown" selectedValue={hours} onValueChange={(itemValue, itemIndex) => setHours(itemValue)}>
          {hoursArray.map((t) => {
            return (<Picker.Item label={t.label} value={t.value} key={t.value}/>)
          })}
        </Picker>
        <Text style={styles.label}>Sukupuoli</Text>
        <Radiobutton options={genderOptions} defaultValue={gender} onPress={(value) => {setGender(value)}} /> 
        <Text style={[bloodAlcLevel >= 1.20 ? styles.bac_danger : bloodAlcLevel >= 0.5 ? styles.bac_warning : styles.bac_ok]}>{bloodAlcLevel.toFixed(2)}</Text>
        <CalculateButton textStyle={styles.buttonText} text={'Tarkista ajokunto'} onPress={calculateBAL}></CalculateButton> 
      </ScrollView>
      <Text style={styles.label}> {[bloodAlcLevel >= 1.20 ? 'Törkeä rattijuopumus' : bloodAlcLevel >= 0.5 ? 'Lievä rattijuopumus' : 'Turvallista matka']} </Text>
    </SafeAreaView>
  );
}
