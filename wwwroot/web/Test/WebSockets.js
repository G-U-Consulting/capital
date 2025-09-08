export default {
    data() {
        return {
            dataList: [],
            userData: null,
            selectedItem: null

        };
    },
    mounted() {
        var data = [];
        for (var i = 0; i < 100; i++) {
            data.push({ id: i, name: "Unidad " + i, lockUser: null });
        }
        this.dataList = data;
        /*TODO Traer desde BD*/var connectionData = {
            "url": "wss://dev.serlefinpbi.com"
        };
        /*TODO Traer desde BD*/this.userData = {
            "socketAppName": "Unidandes",
            "userName": GlobalVariables.username
        };
        GlobalVariables.wsocket = io(connectionData["url"]);
        GlobalVariables.wsocket.on("connect", function () {
            GlobalVariables.wsocket.emit("appSubscribe", { "appName": this.userData["socketAppName"], "userName": this.userData["userName"] });
            console.log("Connected!!");
        }.bind(this));
        GlobalVariables.wsocket.on("selected", function (data) {
            console.log(data);
            var selected = this.dataList.find(item => item["id"] == data["item"]["id"]);
            if (selected != null)
                selected.lockUser = data["user"];//TODO Se debe marcar en la BD que el usuario seleccionó el item
        }.bind(this));
        GlobalVariables.wsocket.on("unselected", function (data) {
            console.log(data);
            var selected = this.dataList.find(item => item["id"] == data["item"]["id"]);
            if (selected != null)
                selected.lockUser = null;//TODO Se debe marcar en la BD que el usuario de-seleccionó el item
        }.bind(this));
    },
    methods: {
        selectItem(item) {
            if (item.lockUser != null) return;
            if (this.selectedItem != null) {
                GlobalVariables.wsocket.emit("sendToApp", { "eventName": "unselected", "appName": this.userData["socketAppName"], "eventData": { "item": this.selectedItem } });
                this.selectedItem.lockUser = null;
            }
            this.selectedItem = item;
            GlobalVariables.wsocket.emit("sendToApp", { "eventName": "selected", "appName": this.userData["socketAppName"], "eventData": { "item": item, "user": this.userData["userName"] }});
            this.selectedItem.lockUser = this.userData["userName"];
        }
    }
};