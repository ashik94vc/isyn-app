import React, {Component} from 'react'
import {RNCamera} from 'react-native-camera'
import {create} from 'apisauce'
import styles from './styles'
import TTS from 'react-native-tts'
import FetchBlob from 'react-native-fetch-blob'
import {View, Text, ToastAndroid} from 'react-native'

export default class CameraView extends Component {

    constructor(props) {
        super(props)
        this.api = create({
            baseURL: "https://google-vision-backend.herokuapp.com"
        })
    }

    render() {
        return(
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                />
            </View>
        )
    }

    getFirstTwoLabels(response) {
        const data = response.data.results
        let first_data = data[0].description
        let second_data = data[Math.floor(Math.random() * (data.length - 1)) + 1].description
        let message = "I see a "+first_data+" or "+second_data 
        ToastAndroid.show(message, ToastAndroid.SHORT)
        TTS.speak(message)
    } 

    async snapPicture() {
        const data = await this.camera.takePictureAsync()
        let form = new FormData()
        form.append('image',{
            name: 'temp.jpg',
            uri: data.uri,
            type: 'image/jpeg'
        })
        const headers = { 'Content-Type': 'multipart/form-data' }
        const backendResponse = await this.api.post('/image', form, {headers})
        this.getFirstTwoLabels(backendResponse)
    }

    componentDidMount() {
        let timer = setInterval(()=>{
            // ToastAndroid.show('Hello', ToastAndroid.SHORT)
            this.snapPicture()
        }, 5000)
    }
}