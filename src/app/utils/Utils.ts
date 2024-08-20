import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export class Utils {

    static async takeOrPickImage(cameraSource: CameraSource) {
        try {
            const image = await Camera.getPhoto({
                quality: 100,
                resultType: CameraResultType.Base64,
                source: cameraSource,
            });
            const base64Img = "data:image/jpeg;base64," + image.base64String;
            const response = await this.getFileImg(base64Img);
            const file = new File([response], "profile.jpg", { type: "image/jpg", lastModified: new Date().getTime() });
            const imgObj = file.name[0];
            return {imgObj,base64Img }
        } catch (error) {
            console.log("🚀 ~ Utils ~ takeOrPickImage ~ error:", error)
            throw Error(JSON.stringify(error))
        }
    }

    private static async getFileImg(base64Img: any): Promise<any> {
        const base64Response = await fetch(base64Img);
        const blob = await base64Response.blob();
        return blob;

    }
}

