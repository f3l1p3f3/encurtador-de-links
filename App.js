import React, {useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert } from 'react-native'
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome5'
import * as Clipborad from 'expo-clipboard'

import { key_api } from "./.api/env.js";


export default function App() {

  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [urlFinal, setUrlFinal] = useState('')
  const [loader, setLoader] = useState(false)

  //Torna um componente simples em um animado
  const MyIcon = Animatable.createAnimatableComponent(Icon);

  // aguarda o retorno da nova URL
  const short = async () => {
    Keyboard.dismiss()
    setLoader(true)

    // verifica se a URL original tem os parametro ' https:// ou http:// '
    //(requisito do site que dispõe o serviço)'
    if (url.includes('https://') || url.includes('http://')) {
      await fetch(`${key_api}&short=${url}&name=${name}`)
        .then(async response => {
          const data = await response.json()

          if (data.url.status === 3) {
            alert("Esse nome ja está incluso")
            return;
          }
          if (data.url.status === 2) {
            alert("url Invalida")
            return;
          }

          setUrlFinal(data.url.shortLink)

        })
      setLoader(false)
      return;
    }

    alert("Ops! Houve um erro.. Verifique sua URL.")
    setLoader(false)
  }

  const copyUrl = async () => {
    await Clipborad.setStringAsync(urlFinal)
      .then(() => {
        alert('URL copiada')
      })
  }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>

        <Animatable.View animation='flipInX' >
          <Text style={styles.firstTitle} >url
            <Text style={styles.lastTitle} >Optimize</Text>
          </Text>
        </Animatable.View>

        <Animatable.View animation='fadeInUp' delay={600} style={{ width: '100%', alignItems: 'center' }}>
          <TextInput
            style={styles.input}
            onChangeText={(url) => setUrl(url)}
            value={url}
            placeholder='Digite sua URL'
          />

          <TextInput
            style={styles.input}
            onChangeText={(optimize) => setName(optimize)}
            value={name}
            placeholder='Nome Personalizado'
          />

        </Animatable.View>
        <Animatable.View animation='zoomIn' delay={700} style={{ width: '100%', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => short()}
          >
            <Text style={styles.buttonText}>Encurtar</Text>
          </TouchableOpacity>

        </Animatable.View>

        <TouchableWithoutFeedback onPress={urlFinal ? copyUrl : () => { }}>
          {loader === true
            ? <MyIcon
              animation='rotate'
              easing='linear'
              iterationCount='infinite'
              name="spinner" size={40}
              color='#00BFFF'
              style={{ marginTop: 20 }}
            />
            : <Text style={styles.urlFinal}>{urlFinal}</Text>}
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  firstTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#21243D',
    marginBottom: 20
  },
  lastTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#00BFFF',
  },
  input: {
    height: 50,
    width: '80%',
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#21243D',
    backgroundColor: '#FAFAFA',
    fontSize: 20,
    fontStyle: 'italic'
  },
  button: {
    height: 40,
    width: '80%',
    backgroundColor: '#FF7C7C',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 20,

  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#F3F3F3',
  },
  urlFinal: {
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#21243D',
    height: 40,
    width: '80%',
    marginTop: 20,
    textAlign: "center"
  },

})