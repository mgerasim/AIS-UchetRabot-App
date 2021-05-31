import Base64 from '@/core/helpers/base64';

const FileHelper = {
    openFileFromResponse(window, response, defaultFileName) {
        var filename = defaultFileName;
        var disposition = response.headers['content-disposition'];
        if(disposition != undefined) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            filename = (matches != null && matches[1] ? matches[1].replace(/['"]/g, '') : defaultFileName);

            filenameRegex = /=?utf-8\?.\?(.*)\?=/;
            matches = filenameRegex.exec(filename);
            if(matches.length > 0) {
                filename = Base64.decode(matches[1]);
            }
        }

        if(window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(response.data, filename);
        } else {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = window.document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            window.document.body.appendChild(link);
            link.click();
            link.remove();
        }
    },    
};

export default FileHelper;