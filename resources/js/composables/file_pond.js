
import vueFilePond from 'vue-filepond';

import "filepond/dist/filepond.min.css";
// Import the plugin code
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

// Import the plugin styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

export const uploadFilePond = (file, progress, field) => {
    const formData = new FormData();
    formData.append('image', file, file.name);
    formData.append(field.name, field.id);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    return axios({
        method: 'post',
        url: '/upload-image',
        data: formData,
        cancelToken: source.token,
        onUploadProgress: (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
        }
    }).then(response => {
        return  response.data
    })
}

export const removeFilePond = (fileUrl) => {
    let data = {
        fileUrl: fileUrl
    }

    return axios.delete('/upload-image',{ data: data })
}

export const setupFilePond = () => {
    return vueFilePond(
        FilePondPluginImagePreview,
        FilePondPluginFileValidateType
    )
}
