import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
// import { Camera, Permissions, FileSystem } from 'expo';

export default class CameraScreen extends React.Component {
    constructor(props) {
        super(props);
        this.camera = null;
    }
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
    };

    // async componentWillMount() {
    //     const { status } = await Permissions.askAsync(Permissions.CAMERA);
    //     this.setState({ hasCameraPermission: status === 'granted' });
    // }

    snap = async () => {
        if (this.camera) {
            let photo = await this.camera.takePictureAsync();
            if (photo) {
                // console.log('original uri', photo.uri);
                // fileName = `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`;
                // try {
                //     await FileSystem.copyAsync({
                //         from: photo.uri,
                //         to: fileName,
                //     });
                // } catch (err) {
                //     console.log('Error saving the file. ', err);
                // }
                this.props.getFotoPath(photo.uri);
            }
            // console.log('photo object...', photo);
        }
    };

    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Camera style={{ flex: 1 }} type={this.state.type}
                        ref={ ref => this.camera = ref }
                    >
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                            }}>
                            {/* <TouchableOpacity
                                style={{
                                    flex: 0.1,
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.setState({
                                        type: this.state.type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back,
                                    });
                                }}>
                                <Text
                                    style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                                    {' '}Flip{' '}
                                </Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                // style={{
                                //     flex: 0.1,
                                //     alignItems: 'center',
                                // }}
                                onPress={() => this.snap()}>
                                <Text
                                    style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                                    {' '}Snap{' '}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        }
    }
}
