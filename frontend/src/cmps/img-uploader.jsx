import { useState } from 'react'
import { uploadService } from '../services/upload.service'
import { File } from "monday-ui-react-core/icons";
import { Icon, Avatar } from "monday-ui-react-core";

export function ImgUploader({ onUploaded = null, task, taskId }) {
  const [imgData, setImgData] = useState({
    imgUrl: null,
    height: 500,
    width: 500,
  })
  const [isUploading, setIsUploading] = useState(false)

  async function uploadImg(ev) {
    let currTask = structuredClone(task)
    console.log(currTask);
    setIsUploading(true)
    const { secure_url, height, width } = await uploadService.uploadImg(ev)
    console.log(taskId);
    console.log(currTask);
    setImgData({ imgUrl: secure_url, width, height })
    setIsUploading(false)
    onUploaded && onUploaded(secure_url)
  }

  function getUploadLabel() {
    if (imgData.imgUrl) return 'Upload Another?'
    return isUploading ? 'Uploading....' : 'Upload Image'
  }

  return (
    <div className="upload-preview align-center justify-center">
      {imgData.imgUrl && <img src={imgData.imgUrl} style={{ maxWidth: '40px' }} />}
      {!imgData.imgUrl && <label className='' htmlFor="imgUpload"> <Icon className="file-icon" icon={File} iconLabel="my bolt svg icon" iconSize={20} ignoreFocusStyle />
      </label>}
      <input type="file" onChange={uploadImg} accept="img/*" id="imgUpload" />
    </div>
  )
}