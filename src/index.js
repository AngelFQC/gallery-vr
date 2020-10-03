import 'aframe';
import 'aframe-physics-system/dist/aframe-physics-system';
import 'aframe-extras';
import 'aframe-layout-component';

AFRAME.registerComponent('set-image', {
    schema: {
        target: {type: 'selector'},
        src: {type: 'selector'}
    },
    init: function () {
        let data = this.data,
            el = this.el;

        el.addEventListener('click', function () {
            data.target.setAttribute('material', 'src', data.src);
        });
    }
});

AFRAME.registerComponent('mozpe-gallery', {
    schema: {
        apiKey: {type: 'string'},
        searchTag: {type: 'string'},
        userId: {type: 'string'},
        target: {type: 'string'}
    },
    apiUrl: 'https://api.flickr.com/services/rest/?',
    aAssets: null,
    init: function () {
        this.aAssets = document.createElement('a-assets');

        this.el.sceneEl.appendChild(this.aAssets);

        //this.loadGallery();
    },
    update: function () {
        this.loadGallery();
    },
    loadGallery: function () {
        let self = this,
            data = this.data,
            urlParams = {
                method: 'flickr.photos.search',
                api_key: data.apiKey,
                tags: data.searchTag,
                user_id: data.userId,
                extras: 'url_sq,url_l',
                format: 'json',
                nojsoncallback: 1,
                per_page: 12
            },
            urlQuery = Object.keys(urlParams).map(key => key + '=' + urlParams[key]).join('&');

        this.aAssets.innerHTML = '';
        this.el.innerHTML = '';

        fetch(this.apiUrl + urlQuery, {cache: "reload"})
            .then(response => response.json())
            .then(json => {
                let w = 0.3,
                    h = w * 3 / 4;
                
                json.photos.photo.forEach((element, index) => {
                    let imgSQ = document.createElement('img'),
                        imgO = document.createElement('img'),
                        aImage = document.createElement('a-image');

                    imgSQ.id = `img-${index}`;
                    imgSQ.src = `${element.url_sq}`;
                    imgSQ.setAttribute('crossorigin', 'anonymous');

                    imgO.id = `img-${index}-o`;
                    imgO.src = `${element.url_l}`;
                    imgO.setAttribute('crossorigin', 'anonymous');

                    aImage.setAttribute('src', `#img-${index}`);
                    aImage.setAttribute('width', `${w}`);
                    aImage.setAttribute('height', `${h}`);
                    aImage.setAttribute('set-image', {
                        target: data.target,
                        src: `#img-${index}-o`
                    });

                    self.aAssets.appendChild(imgSQ);
                    self.aAssets.appendChild(imgO);

                    self.el.appendChild(aImage);
                });
            });
    }
});
