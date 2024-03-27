import * as React from "react"
import{View,Text,Image,Button,Platform} from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"
export default class PickImage extends React.Component{
    state={
        image:null
    }
    componentDidMount(){
      this.getPermission()
    }
    getPermission=async()=>{
if (Platform.OS !=="web") {
    const{status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status !=="granted") {
        alert("sorry, we need camera roll permission to make this work")
    }
}   
    }
    uploadImage=async(uri)=>{
        const data=new FormData()
        var fileName=uri.split("/")[uri.split("/").length-1]
    var type=`image/${uri.split(".")[uri.split(".").length-1]}`
    const fileToUpload={
        uri:uri,name:fileName,type:type
    }
    data.append("Digit",fileToUpload)
    fetch("https://22a7-82-12-102-0.ngrok-free.app/predict-digit",{
        method:"POST",body:data,headers:{
            "content-type":"multipart/form-data"
        }
    })
    .then((response)=>response.json()).then((result)=>{
        console.log("success",result)
    }).catch(error=>{
        console.error("error",error)
    })
    }
    _pickImage=async()=>{
        try{
            var result=await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,allowsEditing:true,aspect:[4,3],quality:1
            })
            if(!result.cancelled){this.setState({image:result.data})
        console.log(result.uri)
    this.uploadImage(result.uri)
        }
        }
        catch(E){console.log(E)}
    }
    render(){
        var{image}=this.state
        return(
            <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                <Button title="pick an image from the camera roll"onPress={this._pickImage}/>
            </View>
        )
    }
}