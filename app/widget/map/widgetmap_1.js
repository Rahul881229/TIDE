import styles from './widgetmap.scss';
let mainMapObject = null;
let mapTypesList = [];
let this_ = null;
let routeETAObj = {
    location: [],
    panel: false
}
let popupDisplayKeys = [];
// import { testFn } from './map/department.js';
import { meterToKm, secondsTimeSpanToHMS } from './mapFunctions.js';
class WidgetMap extends HTMLElement {
    constructor() {
        super();
        // testFn();
        setTimeout(() => {
            let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
            let mapDivWidth = this.hasAttribute("width") ? `width:${this.getAttribute("width")}` : "";
            let mapDivHeight = this.hasAttribute("height") ? `height:${this.getAttribute("height")}` : "";
            let mapDivStyle = '';
            if (mapDivWidth != "" || mapDivHeight != "") {
                mapDivStyle = `style='`;
                if (mapDivWidth != "") {
                    mapDivStyle += mapDivWidth + ";";
                }
                if (mapDivHeight != "") {
                    mapDivStyle += mapDivHeight + ";";
                }
                mapDivStyle += `'`;
            }
            let template = document.createElement('template');
            // let customStyle = this.hasAttribute("customStyle") ? this.getAttribute("customStyle") : "";
            let callbackFn = this.getAttribute("callback");
            // popupDisplayKeys = this.hasAttribute("popup-display-keys") ? JSON.parse(this.getAttribute("popup-display-keys")) : [];

            let mapConfig = this.hasAttribute("map-config") ? JSON.parse(this.getAttribute("map-config")) : {};
            for (const object in mapConfig) {
                console.log(`${object}: ${mapConfig[object]}`);
                appConfigInfo[object] = mapConfig[object];
            }
            template.innerHTML = `
                <style>${styles.toString()}</style>
                <div class='map-widget mainDiv ${theme}' ${mapDivStyle}>
                    <div class='t-widget-map' id='t-widget-map'>
                        <!-- <div class='zoomControl'></div> -->
                        <div class='topLeftTopMenus'>
                            <button value='center' title='Zoom to Home'><img src='./assets/icons/center-focus.png' alt=''/></button>
                            <button value='refresh' title='Refresh Map'><img src='./assets/icons/reload.png' alt=''/></button>
                            <button value='mapType' title='Map Types'><img src='./assets/icons/world.png' alt=''/></button>
                        </div>

                        <div class='topRightMenus'>
                            <button value='point'><img src='data:image/png;base64,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' alt=''/></button>
                            <button value='circle'><img src='data:image/png;base64,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' alt=''/></button>
                            <button value='polygon'><img src='data:image/png;base64,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' alt=''/></button>
                            <button value='line'><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAEAQAAABQ8GUWAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAGAAAABgAPBrQs8AAAAHdElNRQflBhcQGDR3WnWLAAACrklEQVR42u3bP0gbYRzG8efOrEEuEnAruFYQEppFh1wNCkEoFByc2kIpgiRSK0XoInQq6uYSJyuFtKBbIGByvDd0ia3N1IwOmYonDUJxaZq302liU7wk7937R3/bK++F9/uJZxwuGhSbz044/Pv5wQGypgk9FPrvxoLjoJrJaLwPzHrIi6UlLGxve9pccByd94GZTy4a9bx3LhoNed4s6ySPj/Gx0bhcf4vHkTYMd6k+AFZXzQXbdlfkEyFAMumu1bsFepxbD6D+LfAyHie0/ePQMGCrDBDSdZTb1o82N9uDr49St4C1m0igmc16vqDVbCoDYO0mEvqTw0PYw8OeL/pRLivxn2DX+OT5OSI7O/jZanW7hn6p17UHe3vS/w2wlmOxoQ/FIr3XGU9rs7MPG5UKbniLpf4NsJZjsaHvpRJ9E4n8E3+/UvHyGtICsIiXFoBVvJQALOOlA2AdLxWAH/HSAPgVLwWAn/HCA/gdLzRAEPHCAgQVLyRAkPHCAQQdLxQAj3hhAHjFCwHAM547AO94rgAixHMDECWeC4BI8YEDiBYfKICI8YEBiBofCIDI8b4DiB7vK4AM8b4ByBLvC4BM8cwBZItnCiBjPDMAWeOZAMgcPzCA7PEDAagQ3zeAKvF9AagU3zOAavE9AagY7xlA1fhLAELHx4HR0a47pkdGYOVy1x9CbL2fmZl+enTEO2BgAPvV1hadW1nxfIVC8QCgo7q4eFvjAUAjhFLvAPPzpra/z/vQLKfjWWHtXb1Oi/n81U+mpmBPTl6tz854H9hXAPrs5MTU1tbcNaHr60A7gHqjzPcF7gD6nM7vC3ydmCD5UsldaumxMfqa9xGDBEgbBpBKuUvV4wFAR8FxvG7+8+v0lPeB2QNUM5mbELS3Fxd4vLGRCtdqvA/Mev4CCE5v/gJ+cPIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDYtMjNUMTY6MjQ6NTIrMDA6MDDIjhVJAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTA2LTIzVDE2OjI0OjUyKzAwOjAwudOt9QAAAABJRU5ErkJggg==' alt=''/></button>
                            <button value='options'><img src='./assets/icons/double-left-arrows-symbol.png' alt=''/></button>
                            <div class="map-widget__dropdown">
                                <h3 class="map-widget__dropdown-heading"> Widget Menu </h3>
                                <ul class="map-widget__dropdown-list">
                                <li class="map-widget__dropdown-list-item" value="fullscreen">
                                    <span class="map-widget__dropdown-list-item-icon">
                                        <img src="./assets/icons/Fullscreen@2x.png" alt="icon">
                                    </span>
                                    <span class="map-widget__dropdown-list-item-text"> Fullscreen </span>
                                </li>
                                <li class="map-widget__dropdown-list-item" value="minimize">
                                    <span class="map-widget__dropdown-list-item-icon">
                                        <img src="./assets/icons/Minimise@2x.png" alt="icon">
                                    </span>
                                    <span class="map-widget__dropdown-list-item-text"> Minimize </span>
                                </li>
                                </ul>
                            </div>
                        </div>

                        <div class='menus'>
                            <!--<button value='search' title='Search'><img src='./assets/icons/location.png' alt=''/></button> -->
                            <button value='layers' title='Layer Switcher'><img src='./assets/icons/layers_white.png' alt=''/></button>
                            <!--<button value='roadBlock' title='Road Block'><img src='./assets/icons/road-block.png' alt=''/></button> -->
                            <!--<button value='busRoot' title='Bus Root'><img src='./assets/icons/split.png' alt=''/></button>-->
                            <!--<button value='distance' title='Distance Calculator'><img src='./assets/icons/distance_white.png' alt=''/></button>-->
                        </div>
                    </div>
                    
                    <div class='mapType'>
                        <div class='mapTypeHeader'>
                            <label>Map Type</label>
                            <div class='mapTypeClose'><button>&#10005;</button></div>
                        </div>
                        <div class='mapTypeBody'> </div>
                    </div>

                    <div class='layerSwitcher'>
                        <div class='layerSwitcherHeader'>
                            <label>Map Layers</label>
                            <div class='layerSwitcherClose'><button>&#10005;</button></div>
                        </div>
                        <div class='layerSwitcherBody'> </div>
                    </div>

                    <div class='layerDistance'>
                        <div class='layerDistanceHeader'>
                            <label>Route Path</label>
                            <div class='layerDistanceClose'><button>&#10005;</button></div>
                        </div>
                        <div class='layerDistanceBody'>
                            <table>
                            <tr>
                                <td><label>From</label></td>
                                <td><label id='fromdistance'>a</label></td>
                            </tr>
                            <tr>
                                <td><label>To</label></td>
                                <td><label id='todistance'>b</label></td>
                            </tr>
                            </table>
                            <label class='label' id='distance'>Distance : </label><br>
                            <label class='label' id='time'>Time : </label>
                        </div>
                    </div>

                    <div class='layerRoadBlock'>
                        <div class='layerRoadBlockHeader'>
                            <label>Roadblock Notification</label>
                            <div class='layerRoadBlockClose'><button>&#10005;</button></div>
                        </div>
                        <div class='layerRoadBlockBody'>
                            <table>
                            <tr>
                                <td><label>From</label></td>
                                <td><label id='fromRoadBlockdistance'>a</label></td>
                            </tr>
                            <tr>
                                <td><label>To</label></td>
                                <td><label id='toRoadBlockdistance'>b</label></td>
                            </tr>
                            </table>
                            <textarea class='roadBlockMessage' id='roadBlockMessage' placeholder='Write message' rows='4'></textarea>
                            <label class='label'>Channel:</label>
                            <table>
                            <tr>
                                <td><input class='commonCheckbox' type='checkbox' value='PA' name='notify'/></td>
                                <td><label class='label'>Public Announcements</label></td>
                            </tr>
                            <tr>
                                <td><input class='commonCheckbox' type='checkbox' value='VMB' name='notify'/></td>
                                <td><label class='label'>Virtual Message Board</label></td>
                            </tr>
                            </table>
                            <div class='buttonArea'>
                                <t-button primary> Notify </t-button>
                            </div>
                        </div>
                    </div>

                    

                </div>
            `;
            // <img src='https://www.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png' alt=''></img>

            // console.log("widget attribute data -> ", JSON.parse(this.getAttribute("data")));
            this_ = this;
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type == "attributes") {
                        // console.log("attributes changed", mutation);
                        console.log("widget attribute data -> ", JSON.parse(mutation.target.getAttribute('data')));
                        const dataFromUI = JSON.parse(mutation.target.getAttribute('data'));
                        // console.log("dataFromUI.type -> ", dataFromUI.type);
                        // console.log("dataFromUI.data -> ", dataFromUI.data);
                        // console.log("this -> ", this_);
                        switch (dataFromUI.type) {
                            case 'categoryList': this_.layerCategoryList(dataFromUI.data); break;
                            case 'assetData': this_.loadAssets(dataFromUI.data); break;
                            case 'departmentList': this_.layerDepartmentList(dataFromUI.data); break;
                            case 'departmentData': this_.loadDepartments(dataFromUI.data); break;
                            case 'vehicleTrack': break;
                            case 'clusterLayer': this_.loadClusterLayers(dataFromUI); break;
                            case 'layer': this.loadLayers(dataFromUI); break;
                            default: break;
                        }
                    }
                });
            });

            /* observer.observe(this, {
                attributes: true //configure it to listen to attribute changes
            });
            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(template.content.cloneNode(true)); */
            this.appendChild(template.content.cloneNode(true));

            //console.log("shadowRoot -> ", shadowRoot.querySelectorAll('#t-widget-map')[0]);
            //console.log(tmpl.Map);
            // document.getElementsByTagName('t-widget-map')[0].shadowRoot.getElementById('t-widget-map')

            let mapCallBack = (obj) => {
                var checkEvent = new CustomEvent("mapwidget", {
                    bubbles: true,
                    detail: {
                        version: '1.0',
                        method: callbackFn,
                        params: "",
                        data: {
                            type: "mapCreate",
                            data: obj,
                            message: "Map Created Successfully",
                        }
                    }
                });
                if (this.dispatchEvent(checkEvent)) {
                    console.log('Performing default operation');
                }

                mainMapObject = obj;
                console.log("mainMapObject -> ", mainMapObject);
                tmpl.Search.addSearchBox({
                    map: obj,
                    img_url: "",
                    height: 50,
                    width: 20,
                    zoom_button: false
                });
                tmpl.Control.addScale({ map: obj });
                setTimeout(() => {
                    tmpl.Map.resize({ map: obj });
                }, 1000);
                this.loadMapTypes();

            }

            tmpl.Map.mapCreation({
                target: this.querySelector('#t-widget-map'),
                name: 'e',
                mapConfigSetting: appConfigInfo,
                googleStyle: 'darkGrey',
                callBackFunc: mapCallBack
            });

            let getOverlayFeatureDetails = (ids, coords, layerName, properties, mapObject) => {
                console.log("getOverlayFeatureDetails -> ", ids, coords, layerName, properties, mapObject);

                var checkEvent = new CustomEvent("mapwidget", {
                    bubbles: true,
                    detail: {
                        version: '1.0',
                        method: callbackFn,
                        params: "",
                        data: {
                            type: "getOverlayFeature",
                            data: {
                                ids: ids, coords: coords, layerName: layerName, properties: properties, mapObject: mapObject
                            },
                            message: "Map GetOverlay Feature",
                        }
                    }
                });
                if (this.dispatchEvent(checkEvent)) {
                    console.log('Performing default operation');
                }

                if (popupDisplayKeys.length > 0) {
                    if (properties.length == undefined) {
                        this.commonPopup(layerName, properties, mapObject);
                    } else if (properties.length == 1) {
                        this.commonPopup(layerName, properties[0], mapObject);
                    } else if (properties.length > 1 && properties.length <= 20) {
                        var clusterImgs = [];
                        for (let prop of properties) {
                            clusterImgs.push(prop.img_url);
                        }
                        console.log(clusterImgs);
                        let displayDetails = (index) => {
                            this.commonPopup(layerName, properties[index], mapObject);
                            try {
                                var overlayID = mapObject.getOverlayById('clusterOverlayID');
                                if (overlayID) {
                                    mapObject.removeOverlay(overlayID);
                                }
                            } catch (e) { }
                            tmpl.Zoom.toXYcustomZoom({
                                map: mapObject,
                                longitude: properties[index].lon,
                                latitude: properties[index].lat,
                                zoom: appConfigInfo.googleMaxZoom
                            });
                        }
                        tmpl.Overlay.addOverlay({
                            map: mapObject,
                            point: coords,
                            img_url: clusterImgs,
                            count: properties.length,
                            features: properties,
                            callbackFunc: displayDetails
                        });
                    } else {
                        var zoomLevel = mapObject.getView().getZoom();
                        if (zoomLevel < appConfigInfo.googleMaxZoom) {
                            tmpl.Zoom.toXYcustomZoom({
                                map: mapObject,
                                longitude: properties[index].lon,
                                latitude: properties[index].lat,
                                zoom: zoomLevel + 1
                            });
                        }
                    }


                }

            }

            tmpl.Map.getOverlayFeatureDetails({
                callBackFunc: getOverlayFeatureDetails
            });

            var menus = this.querySelectorAll('.t-widget-map .menus button');
            menus.forEach(element => {
                element.addEventListener('click', (e) => {
                    this.menusActions(element.getAttribute('value'));
                })
            });

            var topLeftTopMenus = this.querySelectorAll('.t-widget-map .topLeftTopMenus button');
            topLeftTopMenus.forEach(element => {
                element.addEventListener('click', (e) => {
                    this.topLeftTopMenusActions(element.getAttribute('value'));
                })
                // element.style.display = 'none';
            });

            var topRightMenus = this.querySelectorAll('.t-widget-map .topRightMenus button');
            topRightMenus.forEach(element => {
                element.addEventListener('click', (e) => {
                    let btnvalue = element.getAttribute('value');
                    if (btnvalue == 'options') {
                        let mapWidgetDropdown = this.querySelector('.map-widget__dropdown');
                        e.preventDefault();
                        e.stopPropagation();
                        mapWidgetDropdown.classList.toggle('displayBlock');
                        if (mapWidgetDropdown.classList.contains('displayBlock')) {
                            let mapDropdownList = this.querySelectorAll('.map-widget__dropdown-list-item');
                            mapDropdownList.forEach((item, index) => {
                                item.addEventListener('click', (event) => {
                                    let value = item.getAttribute("value");
                                    console.log(value);
                                    if (value == 'fullscreen') {
                                        // mapWidget.classList.remove('map-widget-resize');
                                        let appFullscreen = this.querySelector('#t-widget-map');
                                        if (appFullscreen.requestFullscreen) {
                                            appFullscreen.requestFullscreen();
                                        } else if (appFullscreen.mozRequestFullScreen) { /* Firefox */
                                            appFullscreen.mozRequestFullScreen();
                                        } else if (appFullscreen.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                                            appFullscreen.webkitRequestFullscreen();
                                        } else if (appFullscreen.msRequestFullscreen) { /* IE/Edge */
                                            appFullscreen.msRequestFullscreen();
                                        }
                                    } else if (value == 'minimize') {
                                        // mapWidget.classList.add('map-widget-resize');
                                        document.exitFullscreen()
                                            .then(() => console.log("Document Exited from Full screen mode"))
                                            .catch((err) => console.error(err))
                                    }
                                });
                            });
                        }
                        // topRightMenus.style.display = 'none';
                    } else {

                    }
                });
            });
        }, 0);
    }

    commonPopup(layerName, property, mapObject) {
        // var popuphtml = "<div>hai</div>"
        var popuphtml = "<div class='trinityTooltip'>" +
            "<div class='toolTitle'>" +
            "<label>Details</label>" +
            // "<div class='tooltipClose'><i class='far fa-window-close'></i></div>" +
            "<button class='tooltipCloseBtn'>X</button>" +
            "</div>" +
            "<div class='toolContent'><div class='toolSplit'>" +
            "<table><colgroup><col style='width:30%'><col style='width:3%'><col style='width:67%'></colgroup>";
        for (let obj of popupDisplayKeys) {
            if (obj.icon && obj.icon != undefined && obj.icon != "") {
                popuphtml += "<tr class='border_bottom'><td><img src='" + obj.icon + "' title='" + obj.key + "'/></td><td><label>:</label></td><td><label>" + this.getValueFromObject(property, obj) + "</label></td></tr>";
            } else {
                popuphtml += "<tr class='border_bottom'><td><label>" + obj.key + "</label></td><td><label>:</label></td><td><label>" + this.getValueFromObject(property, obj) + "</label></td></tr>";
            }
        }
        popuphtml += "</table></div>" +
            "<div class='toolButton'>" +
            "<button class='hvr-pulse-shrink button' value='view'><div class='imgDiv'> View </div></button>" +
            "</div>" +
            "</div></div>";
        tmpl.Tooltip.add({
            map: mapObject,
            html: popuphtml,
            coordinate: [parseFloat(property.lon), parseFloat(property.lat)],
            offset: [0, -30]
        });

        this.querySelector('.tooltipCloseBtn').addEventListener('click', event => {
            console.log(event);
            event.target.closest('.ol-popup').remove();
        });

        this.querySelector('.toolButton button').addEventListener('click', event => {
            let buttonValue = event.currentTarget.value;
            let callbackFn = this.getAttribute("callback");
            var checkEvent = new CustomEvent("mapwidget", {
                bubbles: true,
                detail: {
                    version: '1.0',
                    method: callbackFn,
                    params: "",
                    data: {
                        type: "popup-button-click",
                        data: {
                            value: buttonValue,
                            property: property
                        },
                        message: "Default popup button click event",
                    }
                }
            });
            if (this.dispatchEvent(checkEvent)) {
                console.log('Performing default operation');
            }
        });
    }

    keyValues(objectValue) {
        let keys = Object.keys(objectValue);
        for (let k of keys) {
            let obj = popupDisplayKeys.find(o => o == k);
            if (obj) {
                console.log(objectValue[k]);
                return objectValue[k];
            }
        }
    }

    getValueFromObject(objectValue, keyValue) {
        let keys = Object.keys(objectValue);
        let value = 'NA';
        for (let k of keys) {
            if (k == keyValue.key) {
                value = objectValue[keyValue.key];
            }
        }
        return value;
    }

    layerCategoryList(categoryList) {
        console.log("categoryList -> ", categoryList);

        const checkList = [];
        for (let element of categoryList) {
            var div = document.createElement('div');
            div.className = "ListDiv";

            var checkboxLabel = document.createElement('label');
            checkboxLabel.className = 'checkbox-container';
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = element.name;
            checkbox.checked = true;
            checkbox.id = element.id;
            checkbox.value = element.id;
            checkbox.setAttribute('layerName', element.layerName);
            checkList.push(checkbox);
            var checkboxspan = document.createElement('span');
            checkboxspan.className = 'checkmark';

            checkboxLabel.appendChild(checkbox);
            checkboxLabel.appendChild(checkboxspan);

            var img = document.createElement('img');
            img.src = element.imageUrl;

            var label = document.createElement('label');
            label.className = 'mapLayerLabel';
            label.innerText = element.name;

            div.appendChild(checkboxLabel);
            div.appendChild(img);
            div.appendChild(label);

            let layerSwitcherBody = this.querySelector('.layerSwitcher .layerSwitcherBody');
            layerSwitcherBody.appendChild(div);
        }

        checkList.forEach(element => {
            element.addEventListener('click', (event) => {
                console.log(event.target.checked, element.getAttribute('layerName'));
                this.layerVisibility(element.getAttribute('layerName'), event.target.checked);
            })
        });
    }

    layerDepartmentList(DepartmentList) {
        console.log("DepartmentList -> ", DepartmentList);

        // this.removeEventListenerFn();
        const checkList = [];
        for (let element of DepartmentList) {
            var div = document.createElement('div');
            div.className = "ListDiv";

            var checkboxLabel = document.createElement('label');
            checkboxLabel.className = 'checkbox-container';
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = element.name;
            checkbox.checked = true;
            checkbox.id = element.id;
            checkbox.value = element.id;
            checkbox.setAttribute('layerName', element.layerName);
            var checkboxspan = document.createElement('span');
            checkboxspan.className = 'checkmark';

            checkList.push(checkbox);

            var img = document.createElement('img');
            img.src = element.imageUrl;

            var label = document.createElement('label');
            label.className = 'mapLayerLabel';
            label.innerText = element.name;

            div.appendChild(checkboxLabel);
            div.appendChild(img);
            div.appendChild(label);

            let layerSwitcherBody = this.querySelector('.layerSwitcher .layerSwitcherBody');
            layerSwitcherBody.appendChild(div);
        }

        // console.log("checkList -> ", checkList);
        checkList.forEach(element => {
            element.addEventListener('click', (event) => {
                console.log(event.target.checked, element.getAttribute('layerName'));
                this.layerVisibility(element.getAttribute('layerName'), event.target.checked);
            })
        });
    }

    layerVisibility(layerName, visibility) {
        console.log("layerVisibility -> ", layerName, visibility);
        try {
            tmpl.Layer.changeVisibility({
                map: mainMapObject,
                layer: layerName,
                visible: visibility
            });
        } catch (error) { }
    }

    loadAssets(response) {
        for (let key in response) {
            let item = response[key];
            console.log("item -> ", item);
            console.log("item -> ", item.features);
            console.log("key -> ", key);
            let layerName = key;
            try { tmpl.Layer.clearData({ map: mainMapObject, layer: layerName }); } catch (e) { }
            let deviceData = item.features;
            if (deviceData.length > 0) {
                try {
                    tmpl.Overlay.createWithCluster({
                        map: mainMapObject,
                        features: deviceData,
                        layer: layerName,
                        layerSwitcher: false,
                        distance: 50,
                        radius: 15,
                        fillColor: 'red'
                    });
                    tmpl.Layer.changeVisibility({
                        map: mainMapObject,
                        layer: layerName,
                        visible: true
                    });
                } catch (e) {
                    console.log("createWithCluster catch -> ", e);
                }
            }

        }
    }

    loadLayers(response) {
        console.log("loadLayers -> ", response);
        let layerN = (response.layerName).replace(/\s+/g, '');
        if (response.dataKeys) {
            let dataKeys = response.dataKeys;
            for (let obj of response.data) {
                if (dataKeys.id) obj['id'] = obj[dataKeys.id];
                if (dataKeys.label) obj['label'] = obj[dataKeys.label];
                if (dataKeys.lat) obj['lat'] = obj[dataKeys.lat];
                if (dataKeys.lon) obj['lon'] = obj[dataKeys.lon];
                if (dataKeys.img_url) obj['img_url'] = obj[dataKeys.img_url];
            }
        }
        tmpl.Overlay.create({
            map: mainMapObject,
            features: response.data,
            layer: layerN,
            getHoverLabel: false,
            layerSwitcher: false,
            trackLayer: false,
            icon_scale: 1
        })

        var checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'checkbox-container';
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = layerN;
        checkbox.checked = true;
        checkbox.id = layerN;
        checkbox.value = layerN;
        checkbox.setAttribute('layerName', layerN);
        var checkboxspan = document.createElement('span');
        checkboxspan.className = 'checkmark';
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(checkboxspan);

        var img = document.createElement('img');
        img.src = response.data[0].img_url ? response.data[0].img_url : './assets/icons/marker.png';

        var label = document.createElement('label');
        label.className = 'mapLayerLabel';
        label.innerText = response.layerName;

        var div = document.createElement('div');
        div.className = "ListDiv";
        div.appendChild(checkboxLabel);
        div.appendChild(img);
        div.appendChild(label);

        let layerSwitcherBody = this.querySelector('.layerSwitcher .layerSwitcherBody');
        layerSwitcherBody.appendChild(div);

        let checkboxLayer = this.querySelector('.layerSwitcher .layerSwitcherBody #' + layerN + '');
        checkboxLayer.addEventListener('change', function () {
            this_.layerVisibility(layerN, this.checked);
        });
    }

    loadClusterLayers(response) {
        console.log("loadClusterLayers -> ", response);
        let layerN = (response.layerName).replace(/\s+/g, '');

        if (response.dataKeys) {
            // console.log("dataKeys -> ", response.dataKeys);
            let dataKeys = response.dataKeys;
            for (let obj of response.data) {
                if (dataKeys.id) obj['id'] = obj[dataKeys.id];
                if (dataKeys.label) obj['label'] = obj[dataKeys.label];
                if (dataKeys.lat) obj['lat'] = obj[dataKeys.lat];
                if (dataKeys.lon) obj['lon'] = obj[dataKeys.lon];
                if (dataKeys.img_url) obj['img_url'] = obj[dataKeys.img_url];
            }
            // console.log("response.data -> ", response.data);
        }

        try {
            tmpl.Overlay.createWithCluster({
                map: mainMapObject,
                features: response.data,
                layer: layerN,
                layerSwitcher: false,
                distance: 50,
                radius: 15,
                fillColor: 'green'
            });
            tmpl.Layer.changeVisibility({
                map: mainMapObject,
                layer: layerN,
                visible: true
            });
        } catch (e) {
            console.log("createWithCluster catch -> ", e);
        }


        var checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'checkbox-container';
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = layerN;
        checkbox.checked = true;
        checkbox.id = layerN;
        checkbox.value = layerN;
        checkbox.setAttribute('layerName', layerN);
        var checkboxspan = document.createElement('span');
        checkboxspan.className = 'checkmark';
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(checkboxspan);

        var img = document.createElement('img');
        img.src = response.data[0].img_url ? response.data[0].img_url : './assets/icons/marker.png';

        var label = document.createElement('label');
        label.className = 'mapLayerLabel';
        label.innerText = response.layerName;

        var div = document.createElement('div');
        div.className = "ListDiv";
        div.appendChild(checkboxLabel);
        div.appendChild(img);
        div.appendChild(label);

        let layerSwitcherBody = this.querySelector('.layerSwitcher .layerSwitcherBody');
        layerSwitcherBody.appendChild(div);

        let checkboxLayer = this.querySelector('.layerSwitcher .layerSwitcherBody #' + layerN + '');
        checkboxLayer.addEventListener('change', function () {
            this_.layerVisibility(layerN, this.checked);
        });
    }

    loadDepartments(response) {
        for (let key in response) {
            let item = response[key];
            let layerName = key;
            try { tmpl.Layer.clearData({ map: mainMapObject, layer: layerName }); } catch (e) { }
            let deviceData = item.features;
            if (deviceData.length > 0) {
                try {
                    tmpl.Overlay.createWithCluster({
                        map: mainMapObject,
                        features: deviceData,
                        layer: layerName,
                        layerSwitcher: false,
                        distance: 50,
                        radius: 15,
                        fillColor: 'red'
                    });
                    tmpl.Layer.changeVisibility({
                        map: mainMapObject,
                        layer: layerName,
                        visible: false
                    });
                } catch (e) {
                    console.log("createWithCluster catch -> ", e);
                }
            }
        }
    }

    menusActions(type) {
        switch (type) {
            case 'search': alert(type);
                break;
            case 'layers':
                if (!this.querySelectorAll('.layerSwitcher')[0].classList.contains('displayBlock')) {
                    // this.querySelectorAll('.layerSwitcher')[0].classList.remove("displayNone");
                    this.querySelectorAll('.layerSwitcher')[0].classList.toggle("displayBlock");

                    this.querySelectorAll('.layerSwitcherClose button')[0].addEventListener('click', (e) => {
                        this.querySelectorAll('.layerSwitcher')[0].classList.remove("displayBlock");
                    });
                }
                break;
            case 'roadBlock':
                alert("Select Source and Destination");
                if (!routeETAObj.panel) {
                    let getLocation = (feature) => {
                        console.log(feature, routeETAObj);
                        routeETAObj.location.push({
                            place: feature.place[0],
                            longitude: feature.longitude,
                            latitude: feature.latitude
                        })
                        console.log(routeETAObj.location);

                        if (routeETAObj.location.length == 2) {
                            routeETAObj.panel = true;
                            this.querySelectorAll('.layerRoadBlock')[0].classList.toggle("displayBlock");
                            this.querySelectorAll('.layerRoadBlockClose button')[0].addEventListener('click', (e) => {
                                this.querySelectorAll('.layerRoadBlock')[0].classList.remove("displayBlock");
                                routeETAObj.panel = false;
                                routeETAObj.location = [];
                                tmpl.Info.removeGetPlace({});
                            });
                            this.showRoadBlock(routeETAObj.location);

                            this.querySelectorAll('.layerRoadBlock .buttonArea t-button')[0].addEventListener('click', (e) => {

                                // console.log(this.querySelectorAll('.layerRoadBlockBody input[type=checkbox][name=notify]:checked'));
                                let checkboxInput = this.querySelectorAll('.layerRoadBlockBody input[type=checkbox][name=notify]:checked');
                                let checkedValue = [];
                                // console.log(this.querySelectorAll('.layerRoadBlockBody .roadBlockMessage'));
                                let message = this.querySelectorAll('.layerRoadBlockBody .roadBlockMessage')[0].value;
                                checkboxInput.forEach(element => {
                                    checkedValue.push(element.getAttribute("value"));
                                });
                                var checkEvent = new CustomEvent("mapwidget", {
                                    bubbles: true,
                                    detail: {
                                        version: '1.0',
                                        method: callbackFn,
                                        params: "",
                                        data: {
                                            type: "roadBlock-notify",
                                            notify: checkedValue,
                                            message: message,
                                            location: routeETAObj.location
                                        }
                                    }
                                });
                                if (this.dispatchEvent(checkEvent)) {
                                    console.log('Performing default operation');
                                } else {
                                    console.log("No callback Abvailable");
                                }
                            });

                        }
                    }
                    tmpl.Info.getPlace({
                        callbackFunc: getLocation
                    })
                }
                break;
            case 'distance':
                alert("Select Source and Destination");
                if (!routeETAObj.panel) {
                    let getLocation = (feature) => {
                        console.log(feature, routeETAObj);
                        routeETAObj.location.push({
                            place: feature.place[0],
                            longitude: feature.longitude,
                            latitude: feature.latitude
                        })
                        console.log(routeETAObj.location);

                        if (routeETAObj.location.length == 2) {
                            routeETAObj.panel = true;

                            this.querySelectorAll('.layerDistance')[0].classList.toggle("displayBlock");

                            this.querySelectorAll('.layerDistanceClose button')[0].addEventListener('click', (e) => {
                                this.querySelectorAll('.layerDistance')[0].classList.remove("displayBlock");
                                this.clearDistanceETA();
                                routeETAObj.panel = false;
                                routeETAObj.location = [];
                            });

                            this.clearDistanceETA();
                            this.calculateETA(routeETAObj.location);
                        }
                    }
                    tmpl.Info.getPlace({
                        callbackFunc: getLocation
                    })
                }
                break;
            default: alert(type);
                break;
        }
    }

    showRoadBlock(location) {
        this.querySelectorAll('.layerRoadBlockBody #fromRoadBlockdistance')[0].innerHTML = location[0].place;
        this.querySelectorAll('.layerRoadBlockBody #toRoadBlockdistance')[0].innerHTML = location[1].place;
    }

    clearDistanceETA() {
        try {
            tmpl.Info.removeGetPlace({});
            tmpl.Route.clearRoute({ map: mainMapObject });
            tmpl.Layer.clearData({
                map: mainMapObject,
                layer: 'layerRouteEta'
            });
        } catch (e) { }
    }

    calculateETA(location) {
        try {
            tmpl.Layer.clearData({
                map: mainMapObject,
                layer: 'layerRouteEta'
            });
        } catch (e) { }

        let callbackFunc = (eta, sCoord, dCoord, array, wkt, f) => {
            console.log("eta -> ", eta);
            // console.log("eta -> ", meterToKm(eta.distance.value));
            // console.log("eta -> ", secondsTimeSpanToHMS(eta.duration.value));
            this.querySelectorAll('.layerDistanceBody #fromdistance')[0].innerHTML = location[0].place;
            this.querySelectorAll('.layerDistanceBody #todistance')[0].innerHTML = location[1].place;
            this.querySelectorAll('.layerDistanceBody #distance')[0].innerHTML = 'Distance : ' + meterToKm(eta.distance.value);
            this.querySelectorAll('.layerDistanceBody #time')[0].innerHTML = 'Time : ' + secondsTimeSpanToHMS(eta.duration.value);
        }
        try {
            tmpl.Route.getRoute({
                map: mainMapObject,
                source: [location[0].longitude, location[0].latitude],
                destination: [location[1].longitude, location[1].latitude],
                sourceIcon: "",
                destinationIcon: "",
                wayPointFormat: false,
                waypoints: [],
                waypointsIcon: "",
                route_width: 3,
                route_color: '#0000FF',
                callbackFunc: callbackFunc
            })
        } catch (error) {

        }

    }


    topLeftTopMenusActions(type) {
        switch (type) {
            case 'center':
                this.zoomToCenter();
                break;
            case 'refresh': break;
            case 'mapType':
                // console.log(this.querySelectorAll('.mapType')[0].classList);
                this.querySelector('.mapType').classList.remove("displayNone");
                this.querySelector('.mapType').classList.add("displayBlock");

                var mapTypeBody = this.querySelectorAll('.mapType .mapTypeBody')[0];
                for (let i = 0; i < mapTypesList.length; i++) {
                    const element = mapTypesList[i];

                    var stringMapTypeDiv = document.createElement("div");
                    stringMapTypeDiv.className = "mapTypeContent";
                    stringMapTypeDiv.setAttribute("value", element.id);

                    let image = document.createElement("img");
                    image.src = element.icon;
                    image.alt = "image";

                    let label = document.createElement("label");
                    label.textContent = element.name;

                    stringMapTypeDiv.appendChild(image);
                    const lineBreak = document.createElement('br');
                    stringMapTypeDiv.appendChild(lineBreak);
                    stringMapTypeDiv.appendChild(label);
                    mapTypeBody.appendChild(stringMapTypeDiv);
                }

                console.log("close", this.querySelectorAll('.mapTypeClose')[0]);
                this.querySelectorAll('.mapTypeClose')[0].addEventListener('click', (e) => {
                    // alert(element.getAttribute('value'));
                    this.querySelectorAll('.mapType .mapTypeBody')[0].innerHTML = "";
                    this.querySelectorAll('.mapType')[0].classList.remove("displayBlock");
                    this.querySelectorAll('.mapType')[0].classList.add("displayNone");
                })

                var mapTypes = this.querySelectorAll('.mapType .mapTypeBody .mapTypeContent');
                console.log("mapTypes -> ", mapTypes);
                mapTypes.forEach(element => {
                    element.addEventListener('click', (e) => {
                        // alert(element.getAttribute('value'));
                        this.mapChange(element.getAttribute('value'));
                    })
                });

                break;
            default: break;
        }
    }

    zoomToCenter() {
        tmpl.Zoom.toCenter({
            map: mainMapObject
        });
    }

    loadMapTypes() {
        let mapTypesJson = tmpl.Map.getBaseMaps();

        for (let mType of mapTypesJson) {
            let icon = "";
            switch (mType.id) {
                case 1:
                    icon = "https://maproom-wpengine.netdna-ssl.com/wp-content/uploads/Manchester-map-preview-1-500x307.png";
                    break;
                case 2:
                    icon = "https://miro.medium.com/max/4064/1*qYUvh-EtES8dtgKiBRiLsA.png";
                    break;
                case 3:
                    icon = "https://mediad.publicbroadcasting.net/p/kcho/files/styles/x_large/public/201903/Capture_Paradise.PNG";
                    break;
                case 7:
                    icon = "https://miro.medium.com/max/4024/0*F4QsnZTYhz_xEO2P.png";
                    break;
                default:
                    break;
            }
            if (mType.id == 1 || mType.id == 2 || mType.id == 3 || mType.id == 7) {
                mapTypesList.push({
                    "id": mType.id,
                    "name": mType.name,
                    "icon": icon
                });
            }
        }
        console.log("mapTypesList -> ", mapTypesList);
    }

    mapChange(id) {
        console.log(id);
        try {
            tmpl.Map.switchBaseMaps({
                map: mainMapObject,
                id: id
            });
        } catch (e) { }
    }

    topRightMenusActions(type) {
        alert(type);
    }

    /* getOverlayFeatureDetails = (ids, coords, layerName, properties, mapObject) => {
        console.log(ids, coords, layerName, properties, mapObject);
    } */

    disconnectedCallback() {
        // browser calls this method when the element is removed from the document.
        // (can be called many times if an element is repeatedly added/removed)..
    }

    static get observedAttributes() {
        return ['data', 'theme', 'popup-display-keys', 'map-zoom', 'location', 'map-property', 'map-menu'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log("attributeChangedCallback", name, oldValue, newValue);
        switch (name) {
            case 'map-zoom':
                if (newValue) {
                    if (this) {
                        let visible = newValue == 'true' ? 'block' : 'none';
                        if (this.querySelector(".ol-zoom")) {
                            this.querySelector(".ol-zoom").style.display = visible;
                        }
                    }
                }
                break;
            case 'location':
                if (newValue) {
                    if (this) {
                        let visible = newValue == 'true' ? 'block' : 'none';
                        if (this.querySelector(".search-wrapper")) {
                            this.querySelector(".search-wrapper").style.display = visible;
                        }
                    }
                }
                break;
            case 'map-property':
                if (newValue) {
                    if (this) {
                        let menu = JSON.parse(newValue);
                        if (this.querySelector('.topLeftTopMenus')) {
                            let btnsloop = this.querySelector('.topLeftTopMenus').querySelectorAll('button');
                            for (let element of btnsloop) {
                                element.style.display = 'none';
                            }
                        }
                        if (this.querySelector('.topRightMenus')) {
                            let btnsloop = this.querySelector('.topRightMenus').querySelectorAll('button');
                            for (let element of btnsloop) {
                                element.style.display = 'none';
                            }
                        }
                        for (let m of menu) {
                            switch (m) {
                                case 'center': case 'refresh': case 'mapType':
                                    if (this.querySelector('.topLeftTopMenus')) {
                                        let btns = this.querySelector('.topLeftTopMenus').querySelector('button[value="' + m + '"]');
                                        if (btns) {
                                            btns.style.display = 'initial';
                                        }
                                    }
                                    break;
                                case 'options':
                                    if (this.querySelector('.topRightMenus')) {
                                        let btns = this.querySelector('.topRightMenus').querySelector('button[value="' + m + '"]');
                                        if (btns) {
                                            btns.style.display = 'initial';
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }

                    }
                }
                break;
            case 'map-menu':
                if (newValue) {
                    if (this) {
                        let menu = JSON.parse(newValue);
                        if (menu.length > 0) {
                            if (this.querySelector('.menus')) {
                                this.querySelector('.menus').style.display = 'initial';
                                let btnsloop = this.querySelector('.menus').querySelectorAll('button');
                                for (let element of btnsloop) {
                                    element.style.display = 'none';
                                }
                            }
                            for (let m of menu) {
                                if (this.querySelector('.menus')) {
                                    let btns = this.querySelector('.menus').querySelector('button[value="' + m + '"]');
                                    if (btns) {
                                        btns.style.display = 'initial';
                                    }
                                }
                            }
                        } else {
                            if (this.querySelector('.menus')) {
                                this.querySelector('.menus').style.display = 'none';
                            }
                        }
                    }
                }
                break;
            case 'data':
                if (newValue) {
                    const dataFromUI = JSON.parse(newValue);
                    switch (dataFromUI.type) {
                        case 'categoryList': this.layerCategoryList(dataFromUI.data); break;
                        case 'assetData': this.loadAssets(dataFromUI.data); break;
                        case 'departmentList': this.layerDepartmentList(dataFromUI.data); break;
                        case 'departmentData': this.loadDepartments(dataFromUI.data); break;
                        case 'vehicleTrack': break;
                        case 'clusterLayer': this.loadClusterLayers(dataFromUI); break;
                        case 'layer': this.loadLayers(dataFromUI); break;
                        default: break;
                    }
                }
                break;
            case 'theme':
                if (newValue) {
                    if (this) {
                        let tag = this.querySelector('.mainDiv');
                        if (tag) {
                            if (oldValue) {
                                this.querySelector('.mainDiv').classList.remove(oldValue);
                            }
                            this.querySelector('.mainDiv').classList.add(newValue);
                        }
                    }
                }
                break;
            case 'popup-display-keys':
                if (newValue) {
                    popupDisplayKeys = newValue ? JSON.parse(newValue) : [];
                }
                break;
            default:
                console.log(name);
                break;
        }
    }

    adoptedCallback() {
        // console.log("adoptedCallback:::Html Element", this.getAttribute('datetime'));
        // called when the element is moved to a new document..
        // (happens in document.adoptNode, very rarely used)..
    }

    connectedCallback() { }


}
export default WidgetMap;