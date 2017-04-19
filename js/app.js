(function() {

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 18.479476, lng: -69.9156267}
  });

  const model = [
    {
      name: 'Zona Colonial',
      position: {
        lat: 18.4743124,
        lng: -69.8912537,
      },
      info: ''
    }
  ];

  const mapViewModel = {
    activeNav: ko.observable(false),
    activateSidePanel() {
      this.activeNav(!this.activeNav());
    },
  };

  $('#map').css('height', window.innerHeight - 35);
  ko.applyBindings(mapViewModel);
})();
