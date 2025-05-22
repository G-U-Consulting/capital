export default {
    data() {
        return {
            mode: 0,
            files: [],
            serverFiles: [],
            S3Files: [],
        };
    },
    mounted() {

    },
    methods: {
        handleFileChange(event) {
            showProgress();
            const selectedFiles = event.target.files;
            for (let i = 0; i < selectedFiles.length; i++) {
                this.files.push(selectedFiles[i]);
            }
            event.target.value = null;
            hideProgress();
        },
        async uploadFiles() {
            showProgress();
            var form = new FormData();
            for (let i = 0; i < this.files.length; i++)
                form.append(this.files[i].name, this.files[i]);
            var response = await httpFunc("/file/upload", form);
            console.log(response);
            if (response.isError) {
                showMessage(response.errorMessage);
            } else { 
                this.mode = 1;
                this.serverFiles = response.data;
            }
            hideProgress();
        },
        async S3UploadFiles() {
            showProgress();
            var response = await httpFunc("/file/S3upload", this.serverFiles);
            console.log(response);
            if (response.isError) {
                showMessage(response.errorMessage);
            } else {
                this.mode = 2;
                this.S3Files = response.data;
            }
            hideProgress();
        },
        view(item) {
            window.open(item["serverPath"], "_blank");
        },
        viewS3(item) {
            window.open("/file/S3get/" + item["CacheKey"], "_blank");
        }
    }
};