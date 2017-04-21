(function() {

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 18.479476, lng: -69.9156267}
  });

  const model = [
    {
      name: 'Zona Colonial',
      position: {
        lat: 18.4722516,
        lng: -69.8866591
      },
      info: ''
    },
    {
      name: 'Centro Olimpico',
      position: {
        lat: 18.477685,
        lng: -69.916742
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
      name: 'Faro a Colon',
      position: {
        lat: 18.4784251,
        lng: -69.867889
      },
      info:''
    },
  ];

  class Location {
    constructor(location) {
      this.name = location.name;
      this.location = location;
      this.active = ko.observable(true);
      this.setMarker();
    }

    setMarker() {
      this.marker = new google.maps.Marker({
        position: this.location.position,
        map: map,
        title: this.name
      });

      this.visible = ko.computed(() => {
        this.marker.setMap( this.active() ? map : null)
      })
    }
  }

  const mapViewModel = () => {
    // Observables
    this.activeNav = ko.observable(false);

    this.activateSidePanel = () => {
      this.activeNav(!this.activeNav());
    };
    this.locations = ko.observableArray([]);

    this.filter = ko.observable("");

    this.filterLocations = ko.computed(() => {
      const filter = this.filter().toLowerCase();

      if (!filter) {
        return _.map(this.locations(), item => item.active(true));
      }
      return _.filter(this.locations(), item => {
        const found = item.location.name.toLowerCase()
                   .includes(filter);
        item.active(found);
        return found;
      })
    });
    // Insert default locations
    model.forEach(location => this.locations.push(new Location(location)));
  };
  
  $('#map').css('height', window.innerHeight - 35);
  ko.applyBindings(mapViewModel);
})();
