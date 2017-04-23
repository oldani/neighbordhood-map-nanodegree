function initApp() {
  (function() {

    // Google Maps stuff
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: {lat: 18.479476, lng: -69.9156267}
    });
    const infoWindow = new google.maps.InfoWindow;

    // Default loctions
    const model = [
      {
        name: 'Alcázar de Colón',
        position: {
          lat: 18.4775,
          lng: -69.882778
        },
        info: ''
      },
      {
        name: 'Fortaleza Ozama',
        position: {
          lat: 18.4732,
          lng: -69.88171
        },
        info:''
      },
      {
        name: 'Jardin Botanico',
        position: {
          lat: 18.4935752,
          lng: -69.9535472
        },
        info:''
      },
      {
        name: 'Basilica Cathedral of Santa María la Menor',
        position: {
          lat: 18.472778,
          lng: -69.883889
        },
        info:''
      },
      {
        name: 'Columbus Lighthouse',
        position: {
          lat: 18.4784251,
          lng: -69.867889
        },
        info:''
      },
      {
        name: 'Puerta del Conde',
        position: {
          lat: 18.471499,
          lng: -69.89155
        },
        info:''
      },
      {
        name: 'Altar de la Patria',
        position: {
          lat: 18.471214,
          lng: -69.892433
        },
        info:''
      },
    ];

    // Markers Class
    class Location {
      constructor(location) {
        this.name = location.name;
        this.location = location;
        this.active = ko.observable(true);
        this.setMarker();
      }
      /*
        Create the marker, add listener and load marker data.
      */
      setMarker() {
        this.marker = new google.maps.Marker({
          position: this.location.position,
          map: map,
          title: this.name
        });

        this.visible = ko.computed(() => this.marker.setVisible(this.active()));

        this.marker.addListener('click', () => this.activateMarker());
        this.loadData();
      }

      /*
        Callback bound to click event, set infowindow info and open it and
        add a bounce animation.
      */
      activateMarker() {
        map.panTo(this.marker.getPosition());
        infoWindow.setContent(this.contentString);
        infoWindow.open(map, this.marker);
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => this.marker.setAnimation(null), 1400);
      }

      loadData() {
        // load wikipedia data
        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=
          ${this.name}&format=json&callback=wikiCallback`;
        let contentString = '';

        $.ajax({
          url: wikiUrl,
          dataType: "jsonp",
          jsonp: "callback",
          timeout: 8000,
          success: (response) => {
            const info = response[2][0];
            const url = response[3][0];

            this.contentString = `<div id="content">
                <div id="siteNotice">
                </div>
                <h1 id="firstHeading" class="firstHeading">${this.name}</h1>
                <div id="bodyContent">
                <p> ${info} </p>
                </div>
                <a href="${url}"> ${url} </a>
                </div>`;
          },
          error: (requestObj, errorType, error ) => {
            alert(`An error occur while loading ${this.name} information from Wikipedia Api.
                   ${errorType}: ${error}`);
            console.error(errorType, error);
          }
        })
      };
    };

    const MapViewModel = () => {
      // Observables
      this.activeNav = ko.observable(false);
      this.activateSidePanel = () => this.activeNav(!this.activeNav());
      this.locations = ko.observableArray([]);
      this.filter = ko.observable("");
      this.filterLocations = ko.computed(() => {
        const filter = this.filter().toLowerCase();

        if (!filter) {
          return [].map.call(this.locations(), item => item.active(true));
        }
        return [].filter.call(this.locations(), item => {
          const found = item.location.name.toLowerCase()
                            .includes(filter);
          item.active(found);
          return found;
        })
      });

      this.activateCurrentMarker = marker => marker.activateMarker();
      // Insert default locations
      model.forEach(location => this.locations.push(new Location(location)));
    };

    $('#map').css('height', window.innerHeight - 35);
    ko.applyBindings(MapViewModel);
  })();
};

const mapApiError = () => {
  alert("An error occur trying to load Google Map, please make sure you have internet connection.");
}
